##Synopsis##
A user interface to record and display recordings for the [nginx-rtmp-module](https://github.com/arut/nginx-rtmp-module/).

##Setup##
1. Modify `config.php.example` and `js/appinfo.js.example`.
2. Rename them to `config.php` and `js/appinfo.js`
3. Create a database table:
```
CREATE TABLE IF NOT EXISTS `vodinfo` (
  `datetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `filename` varchar(150) NOT NULL,
  `status` tinytext NOT NULL,
  `title` text NOT NULL,
  UNIQUE KEY `filename` (`filename`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
```
4. Upload the files to a web server / directory of your choice. (Must have PHP, MySQL support.)
5. You will probably need to modify your `nginx.conf` file to allow [CORS](https://enable-cors.org/) for the `/control` location. Copy and paste [this code](https://enable-cors.org/server_nginx.html) into the `location /control {}` section. Be sure to leave any other options that are already set in `/location control`.
6. Open in your browser.

##Other Info##
This project uses:

* [Videojs](http://videojs.com/)
* [Knockout](http://knockoutjs.com/)
* [MysqliDb Class](http://github.com/joshcam/PHP-MySQLi-Database-Class )
* [jQuery](http://jquery.com)
* [Bootstrap](http://getbootstrap.com)

My email address is in my github profile.