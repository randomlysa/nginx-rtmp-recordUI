<!DOCTYPE html>
<html>
  <head>
    <title>nginx-rtmp module recording</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="css/style.css">

  </head>
  <body>

  <?php
    $stream = $_GET['stream'];
    if (!$stream) {
        ?>
        Error: Stream name not specified. <br />
        <form method="POST" action="updateStream.php">
            <input type="text" name="stream" placeholder="Stream Name" />
            <input type="submit" />
        </form>

        <?php
        exit;
    }
  ?>

    <div id="container">

        <div class="col-md-3"></div>

        <div class="col-md-6">

            <h1 id="title">Recording UI</h1>

            <h2 id="recordingStatus" data-bind="text: recordingStatus"></h2>

            <!-- ko if: listOfStreams -->
            <div>
                Select a stream to record:
                <select data-bind="options: listOfStreams, value: stream"></select>
            </div>
            <!-- /ko -->

            <!-- ko ifnot: listOfStreams -->
            <h4>Storage used (MB)</h4>
            <div class="row">
                <div class="col-md-6">
                    Current recording: <span data-bind="text: sizeCurrentRecording"></span>
                </div>
                <div class="col-md-6">
                    Previous recordings: <span data-bind="text: sizeOtherRecordings"></span>
                </div>
            </div>
            <!-- /ko -->

            <a href="videoPlayer.php">Link to video player</a>


            <h4>Title of current video</h4>
            <input data-bind="value: recordingTitle" placeholder="recording title" id="recordingTitle">

            <button id="startRecordingButton" type="button" class="btn btn-primary"
                data-bind="click: startRecording, text: 'Start Recording: ' + stream()">
            </button>
            <button id="stopRecordingButton" type="button" class="btn btn-danger"
                data-bind="click: stopRecording, text: 'Stop Recording: ' + stream()">
            </button>

            <hr>

            <h2 data-bind="text: listOfRecordingsHeaderText"></h2>
            <table id="listOfRecordingsTable" width="100%">
                <thead>
                    <tr>
                        <th>Date/Time</th>
                        <!-- ko if: $root.listOfStreams -->
                            <th>Stream</th>
                        <!-- /ko -->
                        <th>Title</th></tr>
                </thead>
                <tbody data-bind="foreach: listOfRecordings">
                    <tr data-bind="click: $parent.setLoadedInPlayerVideo, css: {recording: status, loadedInPlayer: loadedInPlayer}">
                        <td data-bind="text: datetime"></td>
                        <!-- ko if: $root.listOfStreams -->
                            <td data-bind="text: stream"></td>
                        <!-- /ko -->
                        <td data-bind="text: title"></td>
                    </tr>
                </tbody>
            </table>

            <hr>

            <h4>Title of loaded video (double click to rename)</h4>
            <div id="editVideoTitleBox" data-bind="foreach: currentVideo">
                <h2  data-bind="text: title, css: {editing: editing},
                        attr: { 'filename': filename },
                        event: { dblclick: $parent.editVideoTitle }"></h2>
                </h2>
                <input id="editInput" id="editVideoTitleText" type="text"
                     data-bind="value: title,
                        event: { blur: $parent.updateVideoTitle },
                        css: {editing: editing }">

                <div class="videoJSembed">
                    <iframe data-bind="attr: { 'src': 'videoJSframe.php?source=' + filename() }" id="videoPlayerFrame" allowfullscreen=" allowfullscreen" height="370" style="width: 100%; text-align: center; border: none; padding: none;"></iframe>
                </div>
            </div>


        </div>
        <div class="col-md-3">
            <h3>Status Updates</h3>
            <div data-bind="foreach: statusMessages">
                <p data-bind="text: text, css: type"></p>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <script src="js/knockout-3.4.1.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/appinfo.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>
