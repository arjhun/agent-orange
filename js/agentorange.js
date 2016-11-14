var defaultName = "Agent Orange",
    defaultSlogan = "Make America fluffy again";

if(chrome.storage.sync.get({
  paused: false
},function(res){

  if(!res.paused){

    var finder,
        trumpRegex = /realdonaldtrump|donald j. trump|donald john trump|donaldjtrump|Donald J. Trump|Donald J Trump|donald\strump|donaldjtrump|donaldtrump|\btrump(?='s)|DonaldTrump|\b(trump|donald)(\b|(?='s))/gi,
        sloganRegex = /make america great again/gi;

    function replace(){

      chrome.storage.sync.get({
        theWord: defaultName,
        theSlogan: defaultSlogan
      }, function(items) {

        finder = findAndReplaceDOMText(document.body, {
          find: trumpRegex,
          replace: function(a,b){
            return items.theWord;
          },
	        preset:'prose'
        });

        findAndReplaceDOMText(document.body, {
          find: sloganRegex,
          replace: items.theSlogan,
          preset:'prose'
        });

      });

      chrome.storage.sync.get({
        kittens: true,
        isCustom: false,
        customImage: 'https://placekitten.com/$width/$height'
      }, function(item){
      if(item.kittens == true){
      	$('img,div').each(function(i){

          var alt = $(this).attr("alt"),
              title = $(this).attr('title'),
              src = $(this).attr('src'),
              bg = $(this).css('background-image');

          if((title && title.match(trumpRegex))||(src && src.match(trumpRegex))||(alt && alt.match(trumpRegex)) || (bg &&  bg.match(trumpRegex)) && !$(this).data('kittenChanged')) {
            var imgRef = "https://placekitten.com/$width/$height";

              if(item.isCustom) {
                if(item.customImage){
                  imgRef = item.customImage;
                }

              }
            var width = $(this).width(),
                height = $(this).height();

              if(width > 0 && height > 0){
                 imgRef = imgRef.replace('$width',Math.round(width));
                  imgRef = imgRef.replace('$height', Math.round(height));

                      $(this).css('background-image', 'url(' + imgRef + ')');

                    $(this).attr("src",imgRef);

                  $(this).data('kittenChanged', 'true');
            }
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
