# Basics

A user interface to record and display recordings for the [nginx-rtmp-module](https://github.com/arut/nginx-rtmp-module/). Uses tmux and ffmpeg to record, since I've found
the `/control` option to be unreliable.

## Requirements.
* ffmpeg with libx264 - should work with another format if specified in startStopRecording.php.
* tmux - used to start/stop ffmpeg.
* webserver with PHP/MySQL.

## Setup
1. Modify `config.php.example` and `js/appinfo.js.example`.
2. Rename them to `config.php` and `js/appinfo.js`
3. Create a database table:
```
CREATE TABLE `vodinfo` (
  `datetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `filename` varchar(150) NOT NULL,
  `stream` text NOT NULL,
  `status` tinytext NOT NULL,
  `title` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

```
4. Upload the files to a web server / directory of your choice.
5. Make sure the path to record files that you set in config.php exists and is writeable.
6. Open in your browser.

## Other Info
This project uses:

* [Videojs](http://videojs.com/)
* [Knockout](http://knockoutjs.com/)
* [MysqliDb Class](http://github.com/joshcam/PHP-MySQLi-Database-Class )
* [jQuery](http://jquery.com)
* [Bootstrap](http://getbootstrap.com)
* [ffmpeg](https://github.com/FFmpeg/FFmpeg)

My email address is in my github profile