var stream = window.location.href.split('=')[1];

var Video = function (datetime, stream, filename, status, title) {
  this.datetime = ko.observable(datetime);
  this.stream = ko.observable(stream);
  this.filename = ko.observable(filename);
  this.status = ko.observable(status);
  this.title = ko.observable(title);
  this.loadedInPlayer = ko.observable(false);
  this.editing = ko.observable(false);
}

var ViewModel = function() {
  self = this;

  this.recordingStatus = ko.observable();
  this.listOfRecordings = ko.observableArray();
  this.listOfRecordingsHeaderText = ko.observable();
  this.statusMessages = ko.observableArray();
  // http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
  // set currentVideo to the instance that has loadedInPlayer === true
  this.currentVideo = ko.computed( function() {
    return ko.utils.arrayFilter(this.listOfRecordings(), function(video) {
      if (video.loadedInPlayer() === true) {
        return video;
      }
    });
  }, this);

  if (Array.isArray(stream)) {
    // 'many stream' mode
    this.stream = ko.observable();
    this.listOfStreams = ko.observableArray();
    stream.forEach( function( data ) {
      this.listOfStreams.push(data);
    }, this);
  }

  if (typeof stream == 'string') {
    // 'single stream' mode
    this.listOfStreams = null;
    this.stream = ko.observable(stream);
  }

  this.getAndDisplayRecordings = function( updateUI ) {
    var self = this;
    var updateUI = updateUI;
    var getListOfRecordings = $.ajax({
        url: 'db.php?action=getAllRecordings&stream=' + self.stream(),
        dataType: 'json'
      });
    getListOfRecordings.done( function( video ) {
      self.listOfRecordings(video.map( function ( video ) {
        return new Video(video.datetime, video.stream, video.filename, video.status, video.title );
      }));

      if (video.length === 0) {
        self.listOfRecordingsHeaderText('No Recordings Found');
        $( '#listOfRecordingsTable' ).css('visibility', 'hidden');
        self.renderButtonsAndStatus('notRecording');
      }
      if (updateUI && video.length > 0) {
        self.listOfRecordingsHeaderText('List of Recordings');
        $( '#listOfRecordingsTable' ).css('visibility', 'visible');
        if (video[0].status === 'recording') {
          self.renderButtonsAndStatus('recording', video[0].title);
        } else {
          self.renderButtonsAndStatus('notRecording');
        }

        for (var i = 0; i < self.listOfRecordings().length; i++) {
          var recording = self.listOfRecordings()[i];
          if (!recording.status()) {
            self.setLoadedInPlayerVideo(recording);
            break;
          }
        }
      }
    });
    getListOfRecordings.fail( function( data ) {
       self.statusMessages.push({
          type: 'error',
          text: 'There was a problem with the AJAX request to get the list of recordings.'
        });
    });
  }.bind(this);

  // initial run to set the UI
  this.getAndDisplayRecordings(true);

  this.recordingTitle = ko.observable('');
  this.startRecording = function() {
    var self = this;
    var startRecordingURL = 'startStopRecording.php?command=record&app=' + app + '&stream=' + self.stream();
    var startRecording = $.ajax({
      url: startRecordingURL,
      dataType: 'json'
    });

    // This should return an object that includes the filename.
    startRecording.done( function ( data ) {
      // Todo: add a check later to see if the file exists. If it doesn't, throw
      // an error.
      if (data.listSessions === '') {
        self.statusMessages.push({
          type: 'error',
          text: 'There was a problem starting the recording. Perhaps your stream is not live?'
        });
        return;
      }

      self.statusMessages.push({
          type: 'success',
          text: 'Success. Recording started.'
      });

      // Insert file, title, stream name into the database.
      if (!self.recordingTitle()) {self.recordingTitle(data.filename);}
      var insertRecordingToDB = $.ajax({
        url: 'db.php',
        type: "POST",
        data: {
          action: 'insertNewRecording',
          filename: data.filename,
          title: self.recordingTitle(),
          stream: self.stream()
        }
      });
      insertRecordingToDB.done( function ( data ) {
        console.log('success adding to DB', data);
        self.getAndDisplayRecordings(true);
        self.renderButtonsAndStatus('recording', self.recordingTitle());
      });
      insertRecordingToDB.fail( function () {
        console.log('NOT success adding to DB');
      });
    });

    startRecording.fail( function ( data ) {
      self.statusMessages.push({
          type: 'error',
          text: 'There was a problem with the AJAX request to start recording.'
        });
    });
  }.bind(this);

  this.stopRecording = function() {
    var self = this;
    // var stopRecordingURL = 'http://' + urlToNginxServer + '/control/record/stop?app=' + app + '&stream=' + self.stream().trim();
    var stopRecordingURL = 'startStopRecording.php?command=stoprecord&stream=' + self.stream();
    var stopRecording = $.ajax({
      url: stopRecordingURL,
      dataType: 'text' });

    stopRecording.done( function ( data ) {
      // if the stream stopped publishing but the recording was not turned off yet,
      // nginx will not return any data for /control/record/stop
      if ( data === undefined ) {
        urlToCheckIfLive += self.stream();
        var checkLive = $.ajax({
          // urlToCheckIfLive should return 'live' if live, otherwise 'notlive'
          url: urlToCheckIfLive,
          dataType: 'text'
        })
        checkLive.done( function ( data ) {
          if (data === 'notlive') {
            var updateRecordingInDBUrl = 'db.php?action=updateRecordingThatHasStopped&stream=' + self.stream();
            var updateRecordingInDB = $.ajax( updateRecordingInDBUrl );
            updateRecordingInDB.done( function ( data ) {
              self.statusMessages.push({
                type: 'success',
                text: 'Success. Recording was already stopped, database updated.'
              });
              self.renderButtonsAndStatus('notRecording');
              self.getAndDisplayRecordings(false);
            });
          };
        });
      };

      if ( data ) {
        self.statusMessages.push({
            type: 'success',
            text: 'Success. Recording stopped.'
        });

        var updateRecordingInDBUrl = 'db.php?action=updateRecordingThatHasStopped&stream=' + self.stream();;
        var updateRecordingInDB = $.ajax( updateRecordingInDBUrl );
        updateRecordingInDB.done( function ( data ) {
          self.statusMessages.push({
            type: 'success',
            text: 'Data logged to the database' + data
          });
          self.renderButtonsAndStatus('notRecording');
          self.getAndDisplayRecordings(false);
        });
        updateRecordingInDB.fail( function () {
          self.statusMessages.push({
            type: 'error',
            text: 'There was a problem adding the recording information to the database.'
          });
        });
      };
    }); // end stopRecording.done

    stopRecording.fail( function ( data ) {
      self.statusMessages.push({
          type: 'error',
          text: 'There was a problem with the AJAX request.'
        });
    });

  }.bind(this);

  this.renderButtonsAndStatus = function( status, title ) {
    var self = this;
    if (status === 'recording') {
      self.recordingStatus('Status: Recording');
      self.recordingTitle(title);
      $( '#startRecordingButton' ).css('display', 'none');
      $( '#stopRecordingButton' ).css('display', 'inline');
      this.getStorageUseage();
      window.setInterval( this.getStorageUseage, 15000 );
    }
    if (status === 'notRecording') {
      self.recordingStatus('Status: Not Recording');
      self.recordingTitle('');
      $( '#startRecordingButton' ).css('display', 'inline');
      $( '#stopRecordingButton' ).css('display', 'none');
      this.getStorageUseage();
      window.clearInterval( this.getStorageUseage, 15000 );
    }
  }

  this.setLoadedInPlayerVideo = function ( video ) {
    // set all other videos to inactive
    this.listOfRecordings().forEach( function ( video ) {
      video.loadedInPlayer(false);
    })
    // set clicked video to active
    video.loadedInPlayer(true);
  }.bind(this);

  this.editVideoTitle = function ( video ) {
    video.editing(true);
    $( '#editInput' ).focus();;
  };

  this.updateVideoTitle = function ( video ) {
    var filename = video.filename();
    var newTitle = video.title();

    var updateNewTitle = $.ajax(
      'db.php?action=updateVideoTitle&filename=' + filename + '&newTitle=' + newTitle
    );
    updateNewTitle.done( function( data ) {
      if (data === '1 records were updated') {
        self.statusMessages.push({
          type: 'success',
          text: 'Success. Title updated.'
        });
        self.getAndDisplayRecordings(true);
        video.editing(false);
      }
      else {
       self.statusMessages.push({
          type: 'error',
          text: 'There was an error updating your title.'
        });
      }
    });
    updateNewTitle.fail( function() {
      self.statusMessages.push({
        type: 'error',
        text: 'There was an error making the AJAX call to update your title.'
      });
    });
  }.bind(this);

  this.sizeCurrentRecording = ko.observable();
  this.sizeOtherRecordings = ko.observable();
  this.getStorageUseage = function() {
    var self = this;
    var getStorageUseageAjax = $.ajax({
      url: 'files.php?stream=' + self.stream(),
      dataType: 'json'
    });
    getStorageUseageAjax.done( function( data ) {
      self.sizeCurrentRecording( data.currentRec )
      self.sizeOtherRecordings( data.allRec )
    });
  }.bind(this);
}

ko.applyBindings(new ViewModel());
