// Usage: node app.js URL [PORT]
//
// E.g. node app.js http://localhost:8080/cc.xml 4444

var http    = require('http'),
    sys     = require('sys'),
    url     = require('url'),
    sax     = require('sax'),
    express = require('express'),
    restler = require('restler');

var ccUrl = process.argv[2] || 'http://localhost:4444/sample.xml',
    port  = parseInt(process.argv[3] || 4444, 10),
    pollInterval = 3000,
    state = {
      status: 'pending',
      projects: [],
      lastUpdate: null
    },
    server = express.createServer();

server.get('/cc.json', function(req, res){
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(state));
});

server.use(express['static'](__dirname + '/public'));
server.use(express.errorHandler({showStack: true, dumpExceptions: true}));
server.listen(port);

var poll = function(){
  var parser = sax.parser(/* strict = */ true),
      nodes = [];

  parser.onopentag = function(node){
    if (node.name == 'Project') {
      nodes.push(node.attributes);
    }
  };

  var request = restler.get(ccUrl);

  request.on('success', function(data) {
    parser.write(data + '');
    parser.close();
    state.projects = nodes.map(function(e){
      e.name = e.name.replace(/_/g, ' '); return e;
    });
    state.status = 'success';
    state.lastUpdate = new Date();
    setTimeout(poll, pollInterval);
  });

  request.on('error', function(){
    state.status = 'error';
    setTimeout(poll, pollInterval);
  });
};

poll();
