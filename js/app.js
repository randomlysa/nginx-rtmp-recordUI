var viewModel = function( data ) {
  self = this;

  this.recordingStatus = ko.observable('');
  this.listOfRecordings = ko.observableArray();
  this.statusMessages = ko.observableArray();

  if (typeof stream === 'object') {
    this.stream = ko.observable();
    this.listOfStreams = ko.observableArray();
    stream.forEach( function( data ) {
      this.listOfStreams.push(data);
    }, this);
  }

  if (typeof stream == 'string') {
    this.listOfStreams = null;
    this.stream = ko.observable(stream);
  }

  this.getRecordings = function( updateUI ) {
    var self = this;
    var updateUI = updateUI;
    var getListOfRecordings = $.ajax({
        url: 'db.php?action=getAllRecordings',
        dataType: 'json'
      });
    getListOfRecordings.done( function( data ) {
      self.listOfRecordings(data);
      if (updateUI) {
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
  this.getRecordings(true);

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
      self.renderButtonsAndStatus('recording', self.recordingTitle());

      // sample filename: /tmp/rec/STREAMNAME-UNIQUEID.flv
      var filename = data.split("/")[3];
      if (!self.recordingTitle()) {self.recordingTitle(filename);}
      var insertRecordingToDBUrl = 'db.php?action=insertNewRecording&filename=' + filename +
        '&title=' + self.recordingTitle() + '&stream=' + self.stream();
      var insertRecordingToDB = $.ajax( insertRecordingToDBUrl );
      insertRecordingToDB.done( function ( data ) {
        console.log('success adding to DB', data);
        self.getRecordings(false)
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
      if ( data === undefined ) {
        self.statusMessages.push({
          type: 'error',
          text: 'There was a problem stopping the recording.'
        });
        return;
      }

      self.statusMessages.push({
          type: 'success',
          text: 'Success. Recording stopped.'
        });
      self.renderButtonsAndStatus('notRecording');

      var filename = data.split("/")[3];
      var updateRecordingInDBUrl = 'db.php?action=updateRecordingThatHasStopped&filename=' + filename;
      var updateRecordingInDB = $.ajax( updateRecordingInDBUrl );
      updateRecordingInDB.done( function ( data ) {
        self.statusMessages.push({
          type: 'success',
          text: 'Data logged to the database' + data
        });
        self.getRecordings(false);
      });
      updateRecordingInDB.fail( function () {
        self.statusMessages.push({
          type: 'error',
          text: 'There was a problem adding the recording information to the database.'
        });
      });
    });

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
      $( '#recordingTitle' ).val(title)
      $( '#startRecordingButton' ).css('display', 'none');
      $( '#stopRecordingButton' ).css('display', 'inline');
    }
    if (status === 'notRecording') {
      self.recordingStatus('Status: Not Recording');
      $( '#recordingTitle' ).val('');
      $( '#startRecordingButton' ).css('display', 'inline');
      $( '#stopRecordingButton' ).css('display', 'none');
    }
  }

  this.currentlyPlayingVideoTitle = ko.observable('');
  this.setVideoPlayerFile = function ( data ) {
    var self = this;
    self.currentlyPlayingVideoTitle(data.title)
    $( '#videoPlayerFrame')[0].src = 'videoJSframe.php?source=' + data.filename;
  }.bind(this);
}

ko.applyBindings(new viewModel());