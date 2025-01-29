import options from "../default.options.js";

function bind_events() {
  // chrome.tabs.onUpdated.addListener(function (tabId, info) {
  //   if (info.status == "loading") {
  //     chrome.storage.sync.get("paused", function (res) {
  //       setPausedIcon(tabId, res.paused);
  //     });
  //   }
  // });

  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.hasOwnProperty("paused")) {
      pauseTabs(changes.paused.newValue);
    }
  });
}

chrome.runtime.onInstalled.addListener(async (_) => {
  chrome.storage.sync.get(options, (storedSettings) => {
    storedSettings.donate = true;
    storedSettings.donateLastChanged = Date.now();
    console.log("Loaded default settings:", storedSettings);
    chrome.storage.sync.set(storedSettings);
  });
});

function pauseTabs(paused) {
  chrome.action.setTitle({
    title: paused ? "Trumper Dumper: OFF" : "Trumper Dumper: ON",
  });
  let state = paused ? "icon-paused" : "icon";
  chrome.action.setIcon({
    path: {
      19: `../icons/${state}-19.png`,
      48: `../icons/${state}-48.png`,
      128: `../icons/${state}-128.png`,
    },
  });
}

bind_events();
