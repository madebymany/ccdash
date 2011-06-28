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

  var setStatus = function(text){
    $('#status span').text(text);
  };

  var setUpdated = function(){
    $('#updated span').text('' + new Date());
  };

  var receivedCc = function(data, textStatus){
    setStatus(textStatus);
    if (textStatus != 'success') { return; }
    setUpdated();

    template.render({projects: data.sort(util.sortBy('lastBuildTime')).reverse()});
    setTimeout(shrinkToFit, 1);
  };

  var setVisibility = function(v){
    $('#cc').css('opacity', v);
  };

  var shrinkToFit = function(){
    var fontSize = parseInt($('html').css('font-size'), 10);
    var elem = $('#cc li:last-child');
    if (fontSize < 20 || elem.length < 1) {
      setVisibility(1);
      return;
    }

    setVisibility(0);
    var maxHeight = $('html').outerHeight();
    var delta = elem.offset().top + elem.outerHeight() - maxHeight;
    if (delta > 0) {
      var a = Math.max(Math.ceil(Math.log(delta)), 1);
      $('html').css('font-size', (fontSize - a) + 'px');
      setTimeout(shrinkToFit, 1);
    } else {
      setVisibility(1);
    }
  };

  var pollCc = function(){
    setTimeout(pollCc, pollInterval);
    setStatus('polling …');
    $.get('/cc.json', receivedCc);
  };

  pollCc();

});
