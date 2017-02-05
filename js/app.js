var viewModel = function( data ) {

  /*
  the following vars are defined in appinfo.js
  var urlToNginxServer; // servername.com:8080 - I usually have nginx running on port 8080.
  var app; // often the app name is 'live'
  var streamname;
  */

  this.recordingStatus = ko.observable();
  this.listOfRecordings = ko.observableArray();
  this.statusMessages = ko.observableArray();


  this.getRecordings = function() {
    var self = this;
    var getListOfRecordings = $.ajax({
        url: 'db.php?action=getAllRecordings',
        dataType: 'json'
      });
    getListOfRecordings.done( function( data ) {
      if (data[0].status === 'recording') {
        self.renderButtonsAndStatus('recording', data[0].title);
      } else {
        self.renderButtonsAndStatus('notRecording');
      }
      self.listOfRecordings(data);
      for (var i = 0; i < self.listOfRecordings().length; i++) {
        var recording = self.listOfRecordings()[i];
        if (recording.status === 'recording_done') {
          self.setVideoPlayerFile(recording);
          break;
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
  this.getRecordings();

  this.recordingTitle = ko.observable('');
  this.startRecording = function() {
    var self = this;

    var startRecordingURL = 'http://' + urlToNginxServer + '/control/record/start?app=' + app + '&name=' + streamname;
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
      self.renderButtonsAndStatus('recording');

      // sample filename: /tmp/rec/STREAMNAME-UNIQUEID.flv
      var filename = data.split("/")[3];
      if (!self.recordingTitle()) {self.recordingTitle(filename);}
      var insertRecordingToDBUrl = 'db.php?action=insertNewRecording&filename=' + filename + '&title=' + self.recordingTitle();
      var insertRecordingToDB = $.ajax( insertRecordingToDBUrl );
      insertRecordingToDB.done( function ( data ) {
        console.log('success adding to DB', data);
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
    var stopRecordingURL = 'http://' + urlToNginxServer + '/control/record/stop?app=' + app + '&name=' + streamname;
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
      console.log(filename);
      var updateRecordingInDBUrl = 'db.php?action=updateRecordingThatHasStopped&filename=' + filename;
      var updateRecordingInDB = $.ajax( updateRecordingInDBUrl );
      updateRecordingInDB.done( function ( data ) {
        self.statusMessages.push({
          type: 'success',
          text: 'Data logged to the database' + data
        });
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