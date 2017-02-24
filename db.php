<?php

require_once ('config.php');
require_once ('MysqliDb.php');

date_default_timezone_set('America/Chicago');
$timestamp = date("Y-m-d H:i:s");

$db = new MysqliDb (HOST, USERNAME, PASSWORD, DATABASE);

if ($action = isset($_GET["action"])) {
    $action = $_GET["action"];
}
elseif ($action = isset($_POST["action"])) {
    $action = $_POST["action"];
}

if ($action == "getAllRecordings") {
    // get all recordings, return as JSON object, with newest on top
    // so if anything is being recorded, it should be on top (assuming a single app is being recorded)
    if ($stream = isset($_GET["stream"])) {
        $stream = $_GET["stream"];
    }
    if (!$stream) {
        // temporary. focusing on single stream mode, not on 'admin/all stream' mode.
        echo "Error. No stream specified.";
        exit;
    }

    $db->where ('stream', $stream);
    $db->orderBy("datetime","DESC");
    $allRecordings = $db->get('vodinfo');
    $arrayOfRecordings = array();

    foreach ($allRecordings as $recording) {
        $recordingInfo = array(
            'datetime' => $recording['datetime'],
            'stream' => $recording['stream'],
            'filename' => $recording['filename'],
            'status' => $recording['status'],
            'title' => $recording['title']
        );
        array_push($arrayOfRecordings, $recordingInfo);
    }
    $jsonlistOfRecordings = json_encode($arrayOfRecordings);
    echo $jsonlistOfRecordings;
}

if ($action == "insertNewRecording") {
    // insert should always be recording.
    // update should always be recording_stop
    $filename = $_POST["filename"];
    $title = $_POST["title"];
    $stream = $_POST["stream"];
    $insertFilename = Array (
                   "datetime" => $timestamp,
                   "filename" => $filename,
                   'stream' => $stream,
                   "status" => "recording",
                   "title" => $title
    );
    $id = $db->insert ('vodinfo', $insertFilename);
    if($id) {
        echo 'Filename was added. Id=' . $id;
    }
    else {
        print "Error". $db->getLastError();
    }
}

if ($action == "updateRecordingThatHasStopped") {
    $filename = $_GET["filename"];
    $stream = $_GET["stream"];
    $updateRecording = Array (
                   "status" => ""
    );
    if ($filename) {
        $db->where ('filename', $filename);
    }
    if ($stream) {
        $db->where ('stream', $stream);
    }
    // run the update
    if ($db->update ('vodinfo', $updateRecording)) {
        echo $db->count . ' records were updated';
    }
    else {
        echo 'update failed: ' . $db->getLastError();
    }
}

if ($action == "updateVideoTitle") {
    $filename = $_GET["filename"];
    $newTitle = $_GET["newTitle"];
    $updateVideoTitle = Array (
                   "title" => $newTitle
    );
    $db->where ('filename', $filename);
    // run the update
    if ($db->update ('vodinfo', $updateVideoTitle)) {
        echo $db->count . ' records were updated';
    }
    else {
        echo 'update failed: ' . $db->getLastError();
    }
}

?>