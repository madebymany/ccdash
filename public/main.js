var UI = {
  pollInterval: 5000, // ms

  setStatus: function(text){
    $('#lastStatus').text(text);
  },

  entry: {
    toHtml: function(entry){
      var classes = (entry['lastBuildStatus'] + ' ' + entry['activity']).toLowerCase();
      var jobName = entry['name'].replace(/_/g, ' ');
      return '<li class="' + classes + '"><p>' + jobName + '</p></li>';
    },

    collationKey: function(entry){
      return entry['name'].toLowerCase();
    },

    collatedSort: function(a, b){
      var ka = UI.entry.collationKey(a);
      var kb = UI.entry.collationKey(b);
      return (ka < kb) ? 0 : 1;
    }
  },

  receivedCc: function(data, textStatus){
    setTimeout(UI.pollCc, UI.pollInterval);
    UI.setStatus(textStatus);

    if (textStatus != 'success'){
      return;
    }

    var sorted = data.sort(UI.entry.collatedSort);
    var html = '';
    $.each(sorted, function(i, entry){
      html += UI.entry.toHtml(entry);
    });

    $('#cc').html(html);
  },

  pollCc: function(){
    UI.setStatus('polling …');
    $.get('/cc.json', UI.receivedCc);
  }
}

$(document).ready(UI.pollCc);
