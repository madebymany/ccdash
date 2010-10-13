var UI = {
  pollInterval: 5000, // ms

  setStatus: function(text){
    $('#lastStatus').text(text);
  },

  entry: {
    loadTemplate: function(){
      UI.entry.template = $('#cc').html();
    },

    toHtml: function(entry){
      entry['name'] = entry['name'].replace(/_/g, ' ');
      return UI.entry.template.replace(/\{[a-z+]+\}/gi, function(m){
        return entry[m.replace(/[\{\}]/g, "")];
      });
    },

    sort: function(a, b){
      var ka = a['lastBuildTime'];
      var kb = b['lastBuildTime'];
      if (ka < kb) return 1;
      if (ka > kb) return -1;
      return 0;
    }
  },

  receivedCc: function(data, textStatus){
    UI.setStatus(textStatus);

    if (textStatus != 'success'){
      return;
    }

    var sorted = data.sort(UI.entry.sort);
    var html = '';
    $.each(sorted, function(i, entry){
      html += UI.entry.toHtml(entry);
    });

    $('#cc').html(html);
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
}

$(document).ready(UI.start);
