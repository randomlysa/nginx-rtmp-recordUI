<?php
// this dir contains files necessary to record / play 2017 macs basketball VOD
?>

<!DOCTYPE html>
<html>
  <head>
    <title>nginx-rtmp module recording</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
  </head>
  <body>

    <div id="container">
    <br><br><br><br>

    <a data-bind="click: startRecording">Start Recording</a>

    <br><br><br><br>

    <a data-bind="click: stopRecording">Stop Recording</a>

    </div>

    <script src="js/knockout-3.4.1.js"></script>
    <script src="js/appinfo.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>
