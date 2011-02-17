ccdash
======

A simple dashboard for your build machine. Works with CruiseControl, Hudson,
and anything else that exposes its status using the cctray XML format.

Usage
-----

    node app.js http://your-build-machine.local:8080/cc.xml

Visit the server on port 4444. That's it.

Prerequisites
-------------

* [node.js](http://nodejs.org/)
* [express](http://expressjs.com/)
* [sax](http://github.com/isaacs/sax-js)
* [async](http://github.com/caolan/async)
* [socket.io](http://socket.io/)

You might find [npm](http://npmjs.org/) helpful:

    npm install express sax async socket.io

Browsers
--------

The CSS requires a newish version of WebKit. Chromium nightly should work well.
