// Usage: node app.js URL [PORT]
//
// E.g. node app.js http://localhost:8080/cc.xml 4444

var http    = require('http'),
    sys     = require('sys'),
    sax     = require('sax'),
    url     = require('url'),
    express = require('express');

var ccUrl = url.parse(process.argv[2] || "http://localhost:4444/sample.xml"),
    port  = parseInt(process.argv[3] || 4444, 10),
    app   = express.createServer();

app.get('/cc.json', function(req, res){
  var client = http.createClient(ccUrl.port, ccUrl.hostname),
      creq   = client.request('GET', ccUrl.pathname),
      parser = sax.parser(/* strict = */ true),
      data   = [];

  parser.onopentag = function(node){
    if (node.name == 'Project') {
      data.push(node.attributes);
    }
  };

  client.addListener('error', function(ex){
    sys.log(ex);
  });

  creq.on('response', function(cres){
    cres.on('data', function(chunk){
      parser.write(chunk + '');
    });

    cres.on('end', function(){
      parser.close();
      res.header('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    });
  });

  creq.end();
});

app.use(express.staticProvider(__dirname + '/public'));

app.use(express.errorHandler({showStack: true, dumpExceptions: true}));

app.listen(port);
