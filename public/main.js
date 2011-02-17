var UI = {
  pollInterval: 3000, // ms

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

  receivedCc: function(data, textStatus){
    UI.setStatus(textStatus);
    if (textStatus != 'success') { return; }
    UI.setUpdated();

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

  shrinkToFit: function(){
    var fontSize = parseInt($('html').css('font-size'), 10);
    var elem = $('#cc li:last-child');
    if (fontSize < 20 || elem.length < 1) { return; }

    var maxHeight = $('html').outerHeight();
    var delta = maxHeight - (elem.offset().top + elem.outerHeight());
    if (delta < 0) {
      var a = (delta < -200) ? 10 : 1;
      $('html').css('font-size', (fontSize - a) + 'px');
      setTimeout(UI.shrinkToFit, 1);
    }
  },

  pollCc: function(){
    setTimeout(UI.pollCc, UI.pollInterval);
    UI.setStatus('polling …');
    $.get('/cc.json', UI.receivedCc);
  },

  start: function(){
    UI.entry.loadTemplate();
    UI.pollCc();
  }
};

$(document).ready(UI.start);
