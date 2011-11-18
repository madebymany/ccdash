$(document).ready(function(){

  var Template = function(name){
    var script = $('#' + name);
    this.template = script.html();
    this.container = script.parent();
    script.remove();
  };

  Template.prototype.render = function(data){
    var html = Mustache.to_html(this.template, data);
    if (this.container.html() !== html) {
      this.container.html(html);
    }
  };

  var util = {};

  util.sortBy = function(property){
    return function(a, b){
      var ka = a[property];
      var kb = b[property];
      if (ka < kb) { return -1; }
      if (ka > kb) { return  1; }
      return 0;
    };
  };

  var pollInterval = 3000; // ms

  var template = new Template('projects_template');

  var setHealth = function(ok){
    if (ok) {
      $('html').removeClass('unhealthy').addClass('healthy');
    } else {
      $('html').removeClass('healthy').addClass('unhealthy');
    }
  }

  var setStatus = function(text){
    $('#status span').text(text);
  };

  var setUpdated = function(when){
    $('#updated span').text('' + (when || 'Never'));
  };

  var setVisibility = function(v){
    $('#cc').css('opacity', v);
  };

  var receivedCc = function(data, textStatus){
    if (textStatus != 'success') {
      setStatus('client = ' + textStatus);
      setHealth(false);
      return;
    }

    setUpdated(data.lastUpdate);
    setHealth(data.status == 'success');
    setStatus('client = ' + textStatus + '; server = ' + data.status);

    template.render({projects: data.projects.sort(util.sortBy('lastBuildTime')).reverse()});
    setTimeout(shrinkToFit, 1);
  };

  var shrinkToFit = function(){
    var fontSize = parseInt($('html').css('font-size'), 10);
    var lastItem = $('#cc li:last-child');
    if (fontSize < 20 || lastItem.length < 1) {
      setVisibility(1);
      return;
    }

    var maxHeight = $('html').outerHeight();
    var overflow = lastItem.offset().top + lastItem.outerHeight() - maxHeight;
    if (overflow > 0) {
      setVisibility(0);
      var a = Math.max(Math.ceil(Math.log(overflow)), 1);
      $('html').css('font-size', (fontSize - a) + 'px');
      setTimeout(shrinkToFit, 1);
    } else {
      setVisibility(1);
    }
  };

  var pollCc = function(){
    setTimeout(pollCc, pollInterval);
    setStatus('polling …');
    $.ajax({
      url: '/cc.json',
      success: receivedCc,
      error: function(){ setHealth(false); }
    });
  };

  pollCc();

});
