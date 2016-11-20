$(document).ready(function(){

  $('#donate').click(function(){
      chrome.tabs.create({url: 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JRY7QUL8X4WQS'});
  });

  $( "#applybtn" ).click(function() {
    chrome.storage.sync.set({
      theWord: $("#theword").val(),
      theSlogan: $("#theSlogan").val(),
      kittens: $('#kittens').prop('checked'),
      isCustom: $('#isCustom').prop('checked'),
      customImage:  $("#customImage").val()
    }, function() {
      // Update status to let user know options were saved.
      $('#saved').fadeIn().delay(2000).fadeOut(500);
      chrome.tabs.reload();
    });
  });

  $( "#playPause" ).click(function() {
      chrome.storage.sync.get({paused: false},function(res){
        var state = !res.paused;
        chrome.storage.sync.set({paused: state},function(){
          window.close();
          chrome.tabs.reload();
        });
      });

  });

  $("#kittens").click(function(){
    if($(this).prop('checked')){
      $('#customGroup').show();
    }else{
      $('#customGroup').hide();
    }
  });

  $("#isCustom").click(function(){
    $('#customImage').prop('disabled', function(i, v) { return !v; });
  });

  chrome.storage.sync.get({
    theWord: defaultName,
    theSlogan: defaultSlogan,
    kittens: true,
    paused: false
  },function(items) {
    $('#theword').val(items.theWord);
    $('#theSlogan').val(items.theSlogan);
    $('#kittens').prop('checked', items.kittens);
    $('#isCustom').prop('checked', items.isCustom);
    $('#customImage').val(items.customImage);

    if(items.kittens){
      $('#customGroup').show();
    }

    if(items.isCustom){
      $('#customImage').prop('disabled', false);
    }

    if(!items.paused){
      $('#paused').hide();
      $('#playPauseText').text("Pause");
      $('#playPauseIcon').addClass('glyphicon-pause');
    }else{
      $('#paused').show();
    }
  });

  $("form").submit(function(e){
      e.preventDefault();
  });

});
