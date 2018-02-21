<?php
require('./config.php');

$command = $_GET["command"];
$app = $_GET["app"];
// Steam is used to name the file.
$stream = $_GET["stream"];
// Time is appended to the file name so each file is unique.
$time = time();

$urlToStream = "rtmp://" . URL_TO_STREAMING_SERVER . "/$app/$stream";
$recordCommand = "tmux new-session -d -s ${stream} ffmpeg -i '${urlToStream}' -c copy -f mp4 'recordings/${stream}_${time}.mp4' 2>&1";
$stopRecordCommand = "tmux send-keys -t ${stream} q";

if (!$command) {
  print "No command given. Exiting.";
  exit;
}

$returnedInfo = array();

if ($command == "record") {
  $output = exec($recordCommand);
  // See if the record command returned any info.
  $returnedInfo['tmuxOutput'] = $output;

  // This sleep is annoying, but it returns an empty string for listSessions
  // if the stream isn't live. The session starts, then ffmpeg quits once it
  // doesn't find a stream to record.
  sleep(2);
  // See if the session exists.
  $checkTmux = exec('tmux list-sessions');
  $returnedInfo['listSessions'] = $checkTmux;

  // Add the filename to the array.
  $returnedInfo['filename'] = "${stream}_${time}.flv";

  print json_encode($returnedInfo);
}

if ($command === "stoprecord") {
  /*
  Note: stop record works by sending 'q' to the session, which makes ffmpeg
  quit.
  If nginx "idle_streams on" is set, ffmpeg will stay connected to this
  stream even though it doesn't exist and 'q' will probalby not make it quit.
  However, idle streams on is necessary for relays.
  I have set "idle_streams off" which makes the session quit by itself once
  it realizes the stream doesn't exist.
  */
  $output = shell_exec($stopRecordCommand);
  // Stop recording ajax call expects something to be returned.
  print "stopped";
}
?>
