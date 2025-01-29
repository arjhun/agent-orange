//@ts-check
import findAndReplaceDOMText from "findandreplacedomtext";
import $ from "cash-dom";

let options;
let nameClass = "trump-replace",
  sloganClass = "slogan-replace";

let trumpRegex =
    /realdonaldtrump|Trumpworld|donald_trump|donald j. trump|donald john trump|donaldjtrump|donald j. trump|trump(?:\.\w+)?|donald j trump|donald\strump|donaldjtrump|trumps|donaldtrump|\btrump(?='s)|donaldtrump|\b(trump|donald)(\b|(?='s))/gi,
  sloganRegex = /\b(?:make\s+america\s+great\s+again|maga)\b/gi;

class WordCache extends Set {
  update(newWord) {
    this.forEach((node) => {
      node.innerHTML = newWord;
    });
  }
  revert() {
    this.forEach((node) => {
      node.innerHTML = node.dataset.ogText;
    });
  }
}

const switchImage = (node) => {
  let width = $(node).width(),
    height = $(node).height();
  if (width <= 0 || height <= 0) return;
  let newSrc = createPlaceholderSrc(width, height);

  const name = node.nodeName;
  if (name == "SOURCE") {
    if (node.srcset) node.srcset = newSrc;
  } else if (name == "IMG") {
    if (node.src) node.src = newSrc;
    if (node.srcset) node.srcset = newSrc;
  } else if (name == "DIV") {
    node.style.backgroundImage = `url('${newSrc}')`;
  }
};
/**
 * Hack to observe changes in the image src after caching (google images does this)
 * @param {Node} node
 */
const addObserver = (node) => {
  const config = { attributes: true };
  new MutationObserver(function (mutations, observer) {
    observer.disconnect();
    mutations.forEach(function (mutation) {
      switchImage(node);
    });
    observer.observe(node, config);
  }).observe(node, config);
};

class ImageCache extends Set {
  add(node) {
    addObserver(node);
    return super.add(node);
  }

  update() {
    this.forEach((node) => {
      switchImage(node);
    });
  }
  revert() {
    this.forEach((node) => {
      const $img = $(node);
      const ogSrc = node.dataset.oldSrc,
        ogSrcSet = node.dataset.oldSrcset;
      if (node.nodeName === "SOURCE") {
        if (ogSrcSet) node.srcset = ogSrcSet;
      } else if (node.nodeName === "IMG") {
        if (ogSrc) node.src = ogSrc;
        if (ogSrcSet) node.srcset = ogSrcSet;
      } else if (node.nodeName === "DIV") {
        if (ogSrc) {
          node.style.backgroundImage = ogSrc;
        }
      }
    });
  }
}

const cachedWords = new WordCache();
const cachedSlogans = new WordCache();
const cachedImages = new ImageCache();

function findText(element) {
  if (element.nodeName === "SCRIPT") return;
  if (cachedWords.has(element)) return;
  findAndReplaceDOMText(element, {
    preset: "prose",
    find: trumpRegex,
    replace: function (match) {
      const node = createSpan(options.theWord, nameClass);
      node.dataset.ogText = match.text;
      cachedWords.add(node);
      return node;
    },
  });

  findAndReplaceDOMText(element, {
    preset: "prose",
    find: sloganRegex,
    replace: function (match) {
      const node = createSpan(options.theSlogan, sloganClass);
      node.dataset.ogText = match.text;
      cachedSlogans.add(node);
      return node;
    },
  });
}
/**
 *
 * @param {string} text
 * @param {string} className
 * @returns
 */
function createSpan(text, className) {
  const element = document.createElement("span");
  const elementText = document.createTextNode(text);
  element.appendChild(elementText);
  element.classList.add(...[className]);
  return element;
}

/**
 *
 * @param {HTMLImageElement | HTMLDivElement} element
 * @returns
 */
function findImage(element) {
  const nodeName = element.nodeName;
  if (nodeName !== "IMG" && nodeName !== "DIV") return;
  if (cachedImages.has(element)) return;

  const width = element.offsetWidth,
    height = element.offsetHeight;

  if (width <= 0 || height <= 0) return;

  const imgSrc = createPlaceholderSrc(width, height);

  if (nodeName === "DIV") {
    const bg = element.style.backgroundImage;
    if (bg && trumpRegex.test(bg)) {
      element.style.backgroundImage = `url('${imgSrc}')`;
      element.dataset.oldSrc = bg;
      cachedImages.add(element);
    }
  } else if (nodeName === "IMG") {
    let found;
    // check regex
    if (
      findInAttributes(
        $(element),
        ["alt", "title", "data-title", "src", "srcset"],
        trumpRegex
      )
    ) {
      found = element;
      $(element)
        .siblings("picture source")
        .each(function () {
          //@ts-ignore
          this.dataset.oldSrcset = this.srcset;
          //@ts-ignore
          this.srcset = imgSrc;
          cachedImages.add(this);
        });
    } else {
      let $link = $(element).closest("a");
      if ($link) {
        if (findInAttributes($link, ["alt", "title", "href"], trumpRegex)) {
          found = element;
        }
      }
    }
    if (found) {
      found.dataset.oldSrc = element.getAttribute("src") || "";
      $(found).attr("src", imgSrc);
      cachedImages.add(found);
    }
  }
}

function findInAttributes($element, attributes, regex) {
  // All attributes
  const elementsToCheck = attributes.map((attr) => $element.attr(attr));
  const present = elementsToCheck.some(
    (attribute) => attribute && regex.test(attribute)
  );
  if (present) {
    regex.lastIndex = 0;
  }
  return present;
}

function createPlaceholderSrc(width, height) {
  return (
    options.isCustom && options.customPlaceholderUrl
      ? options.customPlaceholderUrl
      : options.placeholder
  )
    .replace("$width", Math.round(width))
    .replace("$height", Math.round(height));
}

function processNode(node) {
  if (options.paused) return;
  findText(node);
  if (options.shouldReplace) {
    // findImage(node);
    $(node)
      .find("img, div")
      .each(function () {
        //@ts-ignore
        findImage(this);
      });
  }
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (changes.paused) {
    options.paused = changes.paused.newValue;
    if (changes.paused.newValue) {
      cachedWords.revert();
      cachedSlogans.revert();
      cachedImages.revert();
    } else {
      processNode(document.body);
      cachedWords.update(options.theWord);
      cachedSlogans.update(options.theSlogan);
      options.shouldReplace && cachedImages.update();
    }
  }

  if (changes.theWord) {
    let newValue = changes.theWord.newValue;
    options.theWord = newValue;
    cachedWords.update(newValue);
  }

  if (changes.theSlogan) {
    let newValue = changes.theSlogan.newValue;
    options.theSlogan = newValue;
    cachedSlogans.update(newValue);
  }
  if (changes.shouldReplace) {
    options.shouldReplace = changes.shouldReplace.newValue;
    if (!changes.shouldReplace.newValue) {
      cachedImages.revert();
    } else {
      cachedImages.update();
      processNode(document.body);
    }
  }
  if (changes.isCustom || changes.customPlaceholderUrl) {
    options.isCustom = changes.isCustom?.newValue ?? options.isCustom;
    options.customPlaceholderUrl =
      changes.customPlaceholderUrl?.newValue ?? options.customPlaceholderUrl;
    cachedImages.update();
    processNode(document.body);
  }
});

function init() {
  new MutationObserver(function (mutations, observer) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType != Node.ELEMENT_NODE) return;
        processNode(node);
      });
    });
  }).observe(document, {
    subtree: true,
    childList: true,
  });
}

$(function () {
  chrome.storage.sync.get(function (storedOptions) {
    options = storedOptions;
    init();
    processNode(document.body);
  });
});
