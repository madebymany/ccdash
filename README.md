ccdash
======

A simple dashboard for your build machine. Works with CruiseControl, Hudson,
and anything else that exposes its status using the cctray XML format.

Usage
-----

    node app.js http://your-build-machine.local:8080/cc.xml

Visit the server on port 4444. That's it. You can add authentication parameters
in the normal way, viz.:

    node app.js http://user:pass@your-build-machine.local:8080/cc.xml

Prerequisites
-------------

* [node.js](https://nodejs.org/)
* [express](https://expressjs.com/)
* [sax](https://github.com/isaacs/sax-js)
* [restler](https://github.com/danwrong/restler)

You might find [npm](http://npmjs.org/) helpful. If you have npm installed
already, you can install the other dependencies via make:

    make deps

Browsers
--------

The CSS requires a newish version of WebKit. Chromium nightly should work well.
