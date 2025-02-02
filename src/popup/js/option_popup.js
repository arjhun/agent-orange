//@ts-check
import $, { Cash } from "cash-dom";
import defaultOptions from "../../default.options.js";
import analytics from "./utils/analytics.js";

let options;

const donateUrl =
  "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JRY7QUL8X4WQS";

const coffeeUrl = "https://buymeacoffee.com/Arjhun";

let ogForm;

/**@type {Cash}*/
let $form,
  /**@type {Cash}*/ $isCustom,
  /**@type {Cash}*/ $theWord,
  /**@type {Cash}*/ $theSlogan,
  /**@type {Cash}*/ $shouldReplaceBtn,
  /**@type {Cash}*/ $customGroup,
  /**@type {Cash}*/ $customImage,
  /**@type {Cash}*/ $paused,
  /**@type {Cash}*/ $playPauseText,
  /**@type {Cash}*/ $playPauseIcon,
  /**@type {Cash}*/ $saved,
  /**@type {Cash}*/ $applybtn,
  /**@type {Cash}*/ $pausebtn,
  /**@type {Cash}*/ $donateButtons,
  /**@type {Cash}*/ $coffeeButtons,
  /**@type {Cash}*/ $donateDismiss,
  /**@type {Cash}*/ $header,
  /**@type {Cash}*/ $donateAlert;

function render() {
  $theWord.val(options.theWord);
  $theSlogan.val(options.theSlogan);
  $shouldReplaceBtn.prop("checked", options.shouldReplace);
  $isCustom.prop("checked", options.isCustom);
  $customImage.val(options.customPlaceholderUrl);

  $header.attr("title", `version: ${__APP_VERSION__}`);

  if (options.shouldReplace) {
    $customGroup.show();
  } else {
    $customGroup.hide();
  }

  if (options.isCustom) {
    $customImage.prop("disabled", false);
  }

  
  if (!options.paused) {
    $("#container").removeClass("isPaused");
    $playPauseIcon.attr("src", "icons/pause-fill.svg");
    $playPauseText.text("Pause Extention");
    $paused.hide();
  } else {
    $("#container").addClass("isPaused");
    $playPauseIcon.attr("src", "icons/play-fill.svg");
    $playPauseText.text("Resume Extention");
    $paused.show();
  }

  ogForm = $("form").serialize();
  const sinceLastDonate = Date.now() - options.donateLastChanged;
  console.log(sinceLastDonate);
  if (!options.donate && sinceLastDonate >= 7 * 24 * 60 * 60 * 1000) {
    chrome.storage.sync.set({ donate: true, donateLastChanged: Date.now() });
  }

  if (options.donate) {
    $donateAlert.removeAttr("hidden");
  } else {
    $donateAlert.attr("hidden", "");
  }
}

let saveTimeout;

function save() {
  if (saveTimeout) clearTimeout(saveTimeout);
  $saved.show();
  saveTimeout = setTimeout(function () {
    $saved.hide();
  }, 3000);
  $applybtn.attr("disabled", "disabled");
  ogForm = $form.serialize();
}

function cache_dom() {
  $form = $("#optionform");
  $isCustom = $("#isCustom");
  $customImage = $("#customImage");
  $theWord = $("#theword");
  $theSlogan = $("#theSlogan");
  $shouldReplaceBtn = $("#kittens");
  $customGroup = $("#customGroup");
  $paused = $("#paused");
  $playPauseText = $("#playPauseText");
  $playPauseIcon = $("#playPauseIcon");
  ($saved = $("#saved")), ($applybtn = $("#applybtn"));
  $pausebtn = $("#playPause");
  $donateButtons = $(".donateButton");
  $coffeeButtons = $(".coffeeButton");
  $donateDismiss = $(".donateDismiss");
  $donateAlert = $("#donate-alert");
  $header = $("legend").first();
}

function bind_events() {
  $(".close").on("click", function () {
    $(this).parent().hide();
  });

  $form.find("input").on("change input", function () {
    if ($form.serialize() != ogForm) {
      $applybtn.removeAttr("disabled");
    } else {
      $applybtn.attr("disabled", "disabled");
    }
  });

  $donateButtons.on(
    "click",
    /**
     * @param {MouseEvent} e
     */
    function (e) {
      e.preventDefault();
      analytics.fireEvent("donate_url_opened");
      chrome.tabs.create({
        url: donateUrl,
      });
    }
  );

  $coffeeButtons.on(
    "click",
    /**
     * @param {MouseEvent} e
     */
    function (e) {
      e.preventDefault();
      analytics.fireEvent("coffee_url_opened");
      chrome.tabs.create({
        url: coffeeUrl,
      });
    }
  );

  $donateDismiss.each(function () {
    $(this).on("click", function () {
      chrome.storage.sync.set({ donate: false, donateLastChanged: Date.now() });
    });
  });

  $applybtn.on("click", function () {
    chrome.storage.sync.set(
      {
        theWord: $theWord.val(),
        theSlogan: $theSlogan.val(),
        customPlaceholderUrl: $customImage.val(),
      },
      save
    );
  });

  $pausebtn.on("click", function () {
    chrome.storage.sync.set({ paused: !options.paused });
  });

  $shouldReplaceBtn.on("click", function () {
    chrome.storage.sync.set(
      {
        shouldReplace: $(this).prop("checked"),
      },
      save
    );
  });

  $isCustom.on("change", function () {
    chrome.storage.sync.set(
      {
        isCustom: $(this).prop("checked"),
      },
      () => {
        $customImage.prop("disabled", !options.isCustom);
        save();
      }
    );
  });

  $("form").on("submit", function (e) {
    e.preventDefault();
  });
}

chrome.storage.sync.get(function (storedOptions) {
  options = storedOptions;
  $(function () {
    console.log("Loaded default settings:", storedOptions);
    analytics.firePageViewEvent("options_popup", "");
    cache_dom();
    render();
    bind_events();
  });
});

// Listener for changes in storage
chrome.storage.onChanged.addListener((changes, areaName) => {
  let params = {};
  for (const [key, { newValue }] of Object.entries(changes)) {
    if (newValue !== undefined) {
      options[key] = newValue; // Update key in local copy
      if (key in defaultOptions) params[key] = newValue;
    }
  }
  console.log(changes);
  if (Object.entries(params).length > 0) {
    analytics.fireEvent("options_changed", params);
    render();
  }
});
