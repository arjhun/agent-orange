$(document).ready(function(){

  $( "#applybtn" ).click(function() {
    chrome.storage.sync.set({
      theWord: $("#theword").val(),
      kittens: $('#kittens-0').prop('checked')
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

  chrome.storage.sync.get(function(items) {
    $('#theword').val(items.theWord);
    $('#kittens-0').prop('checked', items.kittens);
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
