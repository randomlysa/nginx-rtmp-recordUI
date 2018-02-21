<?php
require('./config.php');

$command = $_GET["command"];
$app = $_GET["app"];
// Steam is used to name the file.
$stream = $_GET["stream"];
// Time is appended to the file name so each file is unique.
$time = time();

$urlToStream = "rtmp://" . URL_TO_STREAMING_SERVER . "/$app/$stream";
$recordCommand = "tmux new-session -d -s ${stream} ffmpeg -i '${urlToStream}' -c copy -f flv 'recordings/${stream}_${time}.flv' 2>&1";
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

  // See if the session exists.
  $checkTmux = exec('tmux list-sessions');
  $returnedInfo['listSessions'] = $checkTmux;

  // Add the filename to the array.
  $returnedInfo['filename'] = "${stream}_${time}.flv";

  print json_encode($returnedInfo);
}

if ($command === "stoprecord") {
  $output = shell_exec($stopRecordCommand);
  // Stop recording ajax call expects something to be returned.
  print "stopped";
}
?>
