var defaultName = "Agent Orange";

if(chrome.storage.sync.get({
  paused: false
},function(res){

  if(!res.paused){

    var finder,
        trumpRegex = /trumpdonald|realdonaldtrump|donaldjohntrump|donaldtrump|donald john trump|donald trump|donald j. trump|donald j trump|donaldjtrump|donaldjohntrump|donald john trump|donaldjtrump|donaldtrump|Donald Donald J. Trump|Donald Trump|trump|donald/gi;

    function replace(){

      chrome.storage.sync.get({
        theWord: defaultName
      }, function(items) {

        finder = findAndReplaceDOMText(document.body, {
          find: trumpRegex,
          replace: function(a,c){
            return items.theWord;
          }

        });

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
      attributes: true
      //...
    });

    replace();

    $(document).ready(function(){

      chrome.storage.sync.get({
        kittens: false
      }, function(item){
      if(item.kittens == true){
        $('img').each(function(i){

          var alt = $(this).attr("alt"),
              title = $(this).attr('title'),
              imgRef = "https://placekitten.com/"+Math.round($(this).width())+"/"+Math.round($(this).height());

          if(title && title.match(trumpRegex)){
              $(this).attr("src",imgRef);
          }

          if (alt && alt.match(trumpRegex)) {
              $(this).attr("src",imgRef);
          }
        });
      }
      });

    });

  }

}));
