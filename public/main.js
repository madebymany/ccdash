var UI = {
  setStatus: function(text){
    $('#status span').text(text);
  },

  setUpdated: function(){
    $('#updated span').text('' + new Date());
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
      setTimeout(UI.shrinkToFit, 1);
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
      UI.setUpdated();
      UI.receivedCc($.parseJSON(m));
    });

    UI.socket.on('disconnect', function(){
      UI.setStatus('Disconnected');
      setTimeout(UI.connectToSocket, 5000);
    });
  },

  shrinkToFit: function(){
    var fontSize = parseInt($('html').css('font-size'), 10);
    if (fontSize < 20) { return; }
    var elem = $('#cc li:last-child');
    var maxHeight = $('html').outerHeight();
    var delta = maxHeight - (elem.offset().top + elem.outerHeight());
    if (delta < 0) {
      var a = (delta < -200) ? 10 : 1;
      $('html').css('font-size', (fontSize - a) + 'px');
      setTimeout(UI.shrinkToFit, 1);
    }
  },

  start: function(){
    UI.entry.loadTemplate();
    UI.connectToSocket();
  }
};

$(document).ready(UI.start);
