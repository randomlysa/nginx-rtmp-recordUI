<?php
// This is the file that actually plays the video.
require_once ('config.php');
$source = $_GET["source"];
?>

<!DOCTYPE html>
<html>
  <head>
    <title>videoJS iframe</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="utf-8">
    <link href="http://vjs.zencdn.net/6.6.3/video-js.css" rel="stylesheet">

  </head>
  <body>
    <video id="my-video" class="video-js vjs-default-skin vjs-16-9 vjs-big-play-centered" controls preload="auto" data-setup="{}">
        <source src="<?php echo URL_TO_RECORDINGS . $source; ?>" type='video/mp4'>
        <p class="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading to a web browser that
            <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
        </p>
    </video>
    <script src="http://vjs.zencdn.net/6.6.3/video.js"></script>

  </body>
</html>
