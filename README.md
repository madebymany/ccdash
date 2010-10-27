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

You might find [npm](http://npmjs.org/) helpful.

Browsers
--------

The CSS in this branch requires a newish version of WebKit and a big screen.
