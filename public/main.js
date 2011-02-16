var UI = {
  setStatus: function(text){
    $('#lastStatus').text(text);
  },

  entry: {
    loadTemplate: function(){
      UI.entry.container = $('#cc');
      UI.entry.template  = UI.entry.container.html();
    },

    toHtml: function(entry){
      entry.name = entry.name.replace(/_/g, ' ');
      return Mustache.to_html(UI.entry.template, entry);
    },

    sort: function(a, b){
      var ka = a.lastBuildTime;
      var kb = b.lastBuildTime;
      if (ka < kb) { return  1; }
      if (ka > kb) { return -1; }
      return 0;
    }
  },

  receivedCc: function(data){
    var sorted = data.sort(UI.entry.sort);
    var html = '';
    $.each(sorted, function(i, entry){
      html += UI.entry.toHtml(entry);
    });

    if (UI.entry.container.html() != html) {
      UI.entry.container.html(html);
    }
  },

  connectToSocket: function(){
    UI.setStatus('Connecting …');

    UI.socket = new io.Socket();
    UI.socket.connect();

    setTimeout(function(){
      if (!UI.socket.connected) {
        UI.connectToSocket();
      }
    }, 5000);

    UI.socket.on('connect', function(){
      UI.setStatus('Connected');
    });

    UI.socket.on('message', function(m){
        console.log(m);
      UI.receivedCc($.parseJSON(m));
    });

    UI.socket.on('disconnect', function(){
      UI.setStatus('Disconnected');
      setTimeout(UI.connectToSocket, 5000);
    });
  },

  start: function(){
    UI.entry.loadTemplate();
    UI.connectToSocket();
  }
};

$(document).ready(UI.start);
