// Usage: node app.js URL [PORT]
//
// E.g. node app.js http://localhost:8080/cc.xml 4444

var http    = require('http'),
    sys     = require('sys'),
    url     = require('url'),
    sax     = require('sax'),
    express = require('express');

var ccUrl = url.parse(process.argv[2] || 'http://localhost:4444/sample.xml'),
    port  = parseInt(process.argv[3] || 4444, 10),
    pollInterval = 3000,
    projects = [],
    server = express.createServer();

server.get('/cc.json', function(req, res){
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(projects));
});

server.use(express['static'](__dirname + '/public'));
server.use(express.errorHandler({showStack: true, dumpExceptions: true}));
server.listen(port);

var poll = function(){
  var httpClient = http.createClient(ccUrl.port, ccUrl.hostname),
      req        = httpClient.request('GET', ccUrl.pathname),
      parser     = sax.parser(/* strict = */ true),
      data       = [];

  parser.onopentag = function(node){
    if (node.name == 'Project') {
      data.push(node.attributes);
    }
  };

  httpClient.addListener('error', function(ex){
    setTimeout(poll, pollInterval);
  });

  req.on('response', function(res){
    res.on('data', function(chunk){
      parser.write(chunk + '');
    });

    res.on('end', function(){
      parser.close();
      setTimeout(poll, pollInterval);
      projects = data.map(function(e){ e.name = e.name.replace(/_/g, ' '); return e });
    });
  });

  req.end();
};

poll();
