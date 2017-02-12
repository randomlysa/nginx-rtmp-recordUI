<?php

$stream = $_GET["stream"];
if (!$stream) { exit; }

$allSizes = array();
$scanDirs = array("/var/vod/", "/tmp/rec/");

foreach ($scanDirs as $dir) {
  $filesThisDir = scandir($dir);
  $thisDirSize = 0;
  foreach ($filesThisDir as $file) {
    if ($file != "." && $file != "..") {
      $checkWhichStreamFileBelongsTo = explode("-", $file);
      if ($stream == $checkWhichStreamFileBelongsTo[0]) {
        $thisDirSize += filesize($dir . $file) / 1000000;
      }
    }
    $allSizes[str_replace("/", "", $dir)] = round($thisDirSize, 2);
  }
}
print json_encode($allSizes);

?>