var defaultName = "Agent Orange";

if(chrome.storage.sync.get({
  paused: false
},function(res){

  if(!res.paused){

    var finder,
        trumpRegex = /trumpdonald|realdonaldtrump|donaldjohntrump|donaldtrump|donald john trump|donald trump|donald j. trump|donald j trump|donaldjtrump|donaldjohntrump|donald john trump|donaldjtrump|donaldtrump|Donald Donald J. Trump|Donald Trump|\b(trump|donald)\b/gi;

    function replace(){

      chrome.storage.sync.get({
        theWord: defaultName
      }, function(items) {

        finder = findAndReplaceDOMText(document.body, {
          find: trumpRegex,
          replace: function(a,c){
            return items.theWord;
          },
	preset:'prose'
        });

      });
	  
	  
      chrome.storage.sync.get({
        kittens: false
      }, function(item){
      if(item.kittens == true){
      	$('img,div').each(function(i){
		
          var alt = $(this).attr("alt"),
              title = $(this).attr('title'),
              src = $(this).attr('src'),
              bg = $(this).css('background-image');

          if((title && title.match(trumpRegex))||(src && src.match(trumpRegex))||(alt && alt.match(trumpRegex)) || (bg &&  bg.match(trumpRegex)) && !$(this).data('kittenChanged')) {
              var imgRef = "https://placekitten.com/"+Math.round($(this).width())+"/"+Math.round($(this).height());
              $(this).attr("src",imgRef);
              if(bg){
                  $(this).css('background-image', 'url(' + imgRef + ')');
              }
              $(this).data('kittenChanged', 'true');
          }
        });
      }
      });

    };

    chrome.storage.onChanged.addListener(function(changes, namespace) {
       replace();
    });

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function(mutations, observer) {
        // fired when a mutation occurs
        replace();
    });

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    observer.observe(document, {
      subtree: true,
      childList: true
      //...
    });

    replace();

  }

}));
