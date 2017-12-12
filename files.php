<?php

$stream = $_GET["stream"];
if (!$stream) { exit; }

$allSizes = array("allRec" => 0, "currentRec" => 0);
$scanDirs = array("/var/www/ss-content/video-recordings/", "/tmp/rec/");

foreach ($scanDirs as $key=>$dir) {
  if ($key == 0) {
    $whichDir = "allRec";
  } else {
    $whichDir = "currentRec";
  }

  $filesThisDir = scandir($dir);
  $thisDirSize = 0;
  foreach ($filesThisDir as $file) {
    if ($file != "." && $file != "..") {
      if (strpos($file, $stream) !== false) {
        $thisDirSize += filesize($dir . $file) / 1000000;
      }
    }
    $allSizes[$whichDir] = round($thisDirSize, 2);
  } // foreach $filesThisDir
} // foreach $scanDirs
print json_encode($allSizes);

?>
