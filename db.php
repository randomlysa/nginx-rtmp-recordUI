<?php

require_once ('config.php');
require_once ('MysqliDb.php');

date_default_timezone_set('America/Chicago');
$timestamp = date("Y-m-d H:i:s");

$db = new MysqliDb (HOST, USERNAME, PASSWORD, DATABASE);

$action = isset($_GET["action"]) ? $_GET["action"] : '';

if ($action == "getAllRecordings") {
    // get all recordings, return as JSON object, with newest on top
    // so if anything is being recorded, it should be on top (assuming a single app is being recorded)
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
    $filename = $_GET["filename"];
    $title = $_GET["title"];
    $stream = $_GET["stream"];
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
                   "status" => "recording_done"
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
?>