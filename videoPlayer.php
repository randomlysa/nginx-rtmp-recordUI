<!DOCTYPE html>
<html>
    <head>
        <title>videosJS player</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta charset="utf-8">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    </head>
  <body>

    <div id="container">
        <div class="row">
            <div class="col-md-3"></div>

            <div class="col-md-6">
                <div class="videoJSembed" data-bind="foreach: currentVideo">
                    <h2 data-bind="text: title()"></h2>
                    <iframe data-bind="attr: {'src': 'videoJSframe.php?source=' + filename() }" id="videoPlayerFrame" allowfullscreen=" allowfullscreen" height="370" style="width: 100%; text-align: center; border: none; padding: none;"></iframe>
                </div>

                <table id="listOfRecordings" width="100%">
                    <thead>
                        <tr><th>Date/Time</th><th>Title</th></tr>
                    </thead>
                    <tbody data-bind="foreach: listOfRecordings">
                        <tr data-bind="click: $parent.setVideoPlayerFile">
                            <td data-bind="text: datetime"></td>
                            <td data-bind="text: title"></td>
                        </tr>
                    </tbody>
                </table>
            <div class="col-md-3"></div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <script src="js/knockout-3.4.1.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/appinfo.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>
