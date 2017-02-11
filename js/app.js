var viewModel = function( data ) {
  self = this;

  this.recordingStatus = ko.observable('');
  this.listOfRecordings = ko.observableArray();
  this.listOfRecordingsHeaderText = ko.observable();
  this.statusMessages = ko.observableArray();

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
        url: 'db.php?action=getAllRecordings',
        dataType: 'json'
      });
    getListOfRecordings.done( function( data ) {
      self.listOfRecordings(data);

      if (data.length === 0) {
        self.listOfRecordingsHeaderText('No Recordings Found');
        $( '#listOfRecordings' ).css('visibility', 'hidden');
        self.renderButtonsAndStatus('notRecording');
      }
      if (updateUI && data.length > 0) {
        self.listOfRecordingsHeaderText('List of Recordings');
        $( '#listOfRecordings' ).css('visibility', 'visible');
        if (data[0].status === 'recording') {
          self.renderButtonsAndStatus('recording', data[0].title);
        } else {
          self.renderButtonsAndStatus('notRecording');
        }

        for (var i = 0; i < self.listOfRecordings().length; i++) {
          var recording = self.listOfRecordings()[i];
          if (recording.status === 'recording_done') {
            self.setVideoPlayerFile(recording);
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
    var startRecordingURL = 'http://' + urlToNginxServer + '/control/record/start?app=' + app + '&name=' + self.stream();
    var startRecording = $.ajax({
      url: startRecordingURL,
      dataType: 'text' });

    startRecording.done( function ( data ) {

      if ( data === undefined ) {
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

      // sample filename: /tmp/rec/STREAMNAME-UNIQUEID.flv
      var filename = data.split('/')[3].split('.')[0] + '.mp4';
      if (!self.recordingTitle()) {self.recordingTitle(filename);}
      var insertRecordingToDBUrl = 'db.php?action=insertNewRecording&filename=' + filename +
        '&title=' + self.recordingTitle() + '&stream=' + self.stream();
      var insertRecordingToDB = $.ajax( insertRecordingToDBUrl );
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
    var stopRecordingURL = 'http://' + urlToNginxServer + '/control/record/stop?app=' + app + '&stream=' + self.stream().trim();
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

        var filename = data.split('/')[3].split('.')[0] + '.mp4';
        var updateRecordingInDBUrl = 'db.php?action=updateRecordingThatHasStopped&filename=' + filename;
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
    }
    if (status === 'notRecording') {
      self.recordingStatus('Status: Not Recording');
      self.recordingTitle('');
      $( '#startRecordingButton' ).css('display', 'inline');
      $( '#stopRecordingButton' ).css('display', 'none');
    }
  }

  this.currentlyPlayingVideoTitle = ko.observable();
  this.currentlyPlayingVideoSrc = ko.observable()
  this.setVideoPlayerFile = function ( data ) {
    var self = this;
    self.currentlyPlayingVideoTitle(data.title)
    self.currentlyPlayingVideoSrc('videoJSframe.php?source=' + data.filename);
  }.bind(this);

  this.editVideoTitle = function () {
    var self = this;
    $( '#editVideoTitle' ).html('<input id="editVideoTitleText" type="text" data-bind="value: currentlyPlayingVideoTitle, event: { change: updateVideoTitle } ">');
    $( '#editVideoTitleText' ).val(self.currentlyPlayingVideoTitle()).focus();;
    ko.applyBindings(self, $( '#editVideoTitleText' )[0]);
  }.bind(this);

  this.updateVideoTitle = function () {
    var self = this;
    // split 'videoJSframe.php?source=filename' and get only the filename
    var filename = self.currentlyPlayingVideoSrc().split("=")[1];
    var newTitle = self.currentlyPlayingVideoTitle();

    $( '#editVideoTitle' ).html(self.currentlyPlayingVideoTitle());

    var updateNewTitle = $.ajax({
      url: 'db.php?action=updateVideoTitle&filename=' + filename + '&newTitle=' + newTitle,
    });
    updateNewTitle.done( function( data ) {
      if (data === '1 records were updated') {
        self.statusMessages.push({
          type: 'success',
          text: 'Success. Title updated.'
        });
        self.getAndDisplayRecordings(true);
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
}

ko.applyBindings(new viewModel());