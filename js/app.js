var viewModel = function( data ) {

  /*
  the following vars are defined in appinfo.js
  var urlToNginxServer; // servername.com:8080 - I usually have nginx running on port 8080.
  var app; // often the app name is 'live'
  var streamname;
  */

  this.recordingStatus = ko.observable();
  this.getRecordings = function() {
    var self = this;
    var getListOfRecordings = $.ajax({
        url: 'db.php?action=getAllRecordings',
        dataType: 'json'
      });
    getListOfRecordings.done( function( data ) {
      if (data[0].status === 'recording') {
        self.recordingStatus('Status: Recording');
      } else {
        self.recordingStatus('Status: Not Recording');
      }
      data.forEach( function( row ) {
        $( '#listOfRecordings' ).append('<tr><td>' + row.datetime + '</td><td>' + row.title + '</td</tr>');
      });
    });
    getListOfRecordings.fail( function( data ) {
      console.log('error');
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
      console.log('success trying to record~~', data);

      // sample filename: /tmp/rec/STREAMNAME-UNIQUEID.flv
      var filename = data.split("/")[3];
      console.log(filename);
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
      console.log('error trying to record~~');
    });
  }.bind(this);

  this.stopRecording = function() {
    var stopRecordingURL = 'http://' + urlToNginxServer + '/control/record/stop?app=' + app + '&name=' + streamname;
    var stopRecording = $.ajax({
      url: stopRecordingURL,
      dataType: 'text' });

    stopRecording.done( function ( data ) {
      console.log('success trying to stop recording', data);

      var filename = data.split("/")[3];
      console.log(filename);
      var updateRecordingInDBUrl = 'db.php?action=updateRecordingThatHasStopped&filename=' + filename;
      var updateRecordingInDB = $.ajax( updateRecordingInDBUrl );
      updateRecordingInDB.done( function ( data ) {
        console.log('success updating to DB', data);
      });
      updateRecordingInDB.fail( function () {
        console.log('NOT success adding to DB');
      });
    });

    stopRecording.fail( function ( data ) {
      console.log('error trying to record~~');
    });

  }.bind(this);
}

ko.applyBindings(new viewModel());