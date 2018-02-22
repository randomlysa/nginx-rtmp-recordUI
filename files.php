<?php
require('./config.php');

$stream = $_GET["stream"];
// TODO: POST currently recorded file name here to check size?
if (!$stream) { exit; }

$allSizes = array("allRec" => 0, "currentRec" => 0);
$scanDirs = array(PATH_TO_RECORDINGS, "/tmp/rec/");

$recordedFiles = scandir(PATH_TO_RECORDINGS);
// This now includes all recordings, including current.
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
