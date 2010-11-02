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
* [mustache](http://github.com/janl/mustache.js)

You might find [npm](http://npmjs.org/) helpful.

Browsers
--------

It should look as intended in newer versions of Chromium and Firefox. It may
work in other browsers. Internet Explorer 6 will probably look awful  - if it
works at all.

Look at the `mxm` branch for a bolder design that we're using in-house.
