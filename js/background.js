chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    chrome.tabs.getAllInWindow(null, function(tabs){
    for (var i = 0; i < tabs.length; i++) {
      if( request.paused === false ) {
        chrome.browserAction.setIcon({
        path: {
          "19":"icon-19.png",
                            "48":"icon-48.png",
                            "128": "icon-128.png"
        }, tabId: tabs[i].id
      });
      }

      if( request.paused === true ) {
        chrome.browserAction.setIcon({
        path: {
          "19":"icon-paused-19.png",
                            "48":"icon-paused-48.png",
                            "128": "icon-paused-128.png"
        },
         tabId: tabs[i].id
      });
      }
    }
});


  }
);
