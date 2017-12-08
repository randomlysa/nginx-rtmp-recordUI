<?php

# https://stackoverflow.com/a/14114419
function clean($string) {
    $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
    return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}

$stream = clean($_POST["stream"]);

$http_host =  "http://{$_SERVER['HTTP_HOST']}";
$request =  substr($_SERVER['REQUEST_URI'], 0, 12);

header('Location: ' . $http_host . $request . "?stream=" . $stream);

?>
