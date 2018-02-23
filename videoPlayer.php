<!DOCTYPE html>
<html>
    <head>
        <title>videosJS player</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta charset="utf-8">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        <link rel="stylesheet" type="text/css" href="css/style.css">
    </head>
  <body>

    <div id="container">

        <!-- ko foreach: currentVideo -->
        <h2 data-bind="text: title()"></h2><br>
        <div class="videoJSembed">
            <iframe
                data-bind="attr: {'src': 'videoJSframe.php?source=' + filename() }"
                id="videoPlayerFrame"
                allowfullscreen="allowfullscreen"
                scrolling="no"
            >
            </iframe>
        </div><!-- videoJSembed -->
        <!-- /ko -->

        <hr />

        <table id="listOfRecordingsTable" width="100%">
            <thead>
                <tr>
                    <th>Date/Time</th>
                    <th>Title</th></tr>
            </thead>
            <tbody data-bind="foreach: listOfRecordings">
                <tr data-bind="click: $parent.setLoadedInPlayerVideo, css: {recording: status, loadedInPlayer: loadedInPlayer}">
                    <td data-bind="text: moment(datetime(), 'YYYY-MM-DD HH:mm:ss').format('dddd A, MMMM D, YYYY')"></td>
                    <td data-bind="text: title"></td>
                </tr>
            </tbody>
        </table>

    </div>

    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <script src="js/knockout-3.4.1.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/moment.js"></script>
    <script src="js/appinfo.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>
