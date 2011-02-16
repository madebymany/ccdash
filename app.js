// Usage: node app.js URL [PORT]
//
// E.g. node app.js http://localhost:8080/cc.xml 4444

var http    = require('http'),
    sys     = require('sys'),
    sax     = require('sax'),
    url     = require('url'),
    async   = require('async'),
    io      = require('socket.io'),
    express = require('express');

var ccUrl = url.parse(process.argv[2] || "http://localhost:4444/sample.xml"),
    port  = parseInt(process.argv[3] || 4444, 10);

var server, socket, clients = [], lastMessage;

server = express.createServer();
server.use(express.staticProvider(__dirname + '/public'));
server.use(express.errorHandler({showStack: true, dumpExceptions: true}));
server.listen(port);
socket = io.listen(server);

socket.on('connection', function(client){
  clients.push(client);
  if (lastMessage) {
    client.send(lastMessage);
  }
  client.on('disconnect', function(){
    clients.splice(clients.indexOf(client));
  });
});

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
    setTimeout(poll, 3000);
  });

  req.on('response', function(res){
    res.on('data', function(chunk){
      parser.write(chunk + '');
    });

    res.on('end', function(){
      parser.close();
      setTimeout(poll, 3000);
      var message = JSON.stringify(data);

      if (lastMessage === message) { return; }

      lastMessage = message;
      async.forEach(clients, function(c){
        c.send(message);
      }, function(){});
    });
  });

  req.end();
};

setTimeout(poll, 3000);
