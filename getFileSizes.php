<?php
require('./config.php');

$stream = $_GET["stream"];
$currentRecording = $_GET["currentRecording"];
// TODO: POST currently recorded file name here to check size?
if (!$stream) { exit; }

$allSizes = array("allRec" => 0, "currentRec" => 0);

// Get size of current recording.
$allSizes['currentRec'] = round(filesize(PATH_TO_RECORDINGS . $currentRecording) / 1000000, 2);

// Get size of all recordings, including current.
$recordedFiles = scandir(PATH_TO_RECORDINGS);
$sizeOfAllRecordings = 0;

foreach ($recordedFiles as $file) {
  if ($file != "." && $file != "..") {
    if (strpos($file, $stream) !== false) {
      $sizeOfAllRecordings += filesize(PATH_TO_RECORDINGS . $file) / 1000000;
    }
  }
  $allSizes['allRec'] = round($sizeOfAllRecordings, 2);
} // foreach $recordedFiles

print json_encode($allSizes);

?>
