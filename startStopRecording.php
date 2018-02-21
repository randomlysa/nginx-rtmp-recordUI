<?php
require('./config.php');

$command = $_GET["command"];
$app = $_GET["app"];
// Steam is used to name the file.
$stream = $_GET["stream"];
// Time is appended to the file name so each file is unique.
$time = time();

$urlToStream = "rtmp://" . URL_TO_STREAMING_SERVER . "/$app/$stream";
$recordCommand = "tmux new-session -d -n ${stream} ffmpeg -i '${urlToStream}' -c copy -f flv 'recordings/${stream}_${time}.flv' 2>&1";
$stopRecordCommand = "tmux send-keys -t ${stream} q";

if (!$command) {
  print "No command given. Exiting.";
  exit;
}

if ($command == "record") {
  $output = shell_exec($recordCommand);
  // Print the filename - it's returned as 'data' in the ajax call, inserted
  // into the database and it might be used to check if the recording really
  // started.
  print "${stream}_${time}.flv";
}

if ($command === "stoprecord") {
  $output = shell_exec($stopRecordCommand);
}
?>
