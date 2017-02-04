<?php
// this dir contains files necessary to record / play 2017 macs basketball VOD
?>

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

    <div id="container">
    <h1>Recording UI</h1>

        <div class="col-md-3"></div>

        <div class="col-md-6">

            <h2 data-bind="text: recordingStatus"></h2>

            <input data-bind="value: recordingTitle" placeholder="recording title">
            <button type="button" class="btn btn-primary" data-bind="click: startRecording">Start Recording</button>
            <button type="button" class="btn btn-danger" data-bind="click: stopRecording">Stop Recording</button>

            <hr>

            <h2>List of Recordings</h2>
            <table id="listOfRecordings" style="text-align: center;">
                <tr>
                    <th>Date/Time</th><th>Title</th>
                </tr>
            </table>

    </div>

    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <script src="js/knockout-3.4.1.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="http://vjs.zencdn.net/5.16.0/video.js"></script>
    <script src="js/appinfo.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>
