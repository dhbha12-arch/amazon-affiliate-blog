/* Amazon Affiliate Smart Interest Widget for Blogger - Desktop + Mobile
 * Amazon India Associate tag: wwwblogge0295-21
 * Uses Amazon search links only. No Amazon browsing-history access, tracking pixels,
 * scraping, fabricated prices or product images.
 * Reader preferences are saved in this browser only after clicking "Remember my choice".
 * Add this script once before </body> in the Blogger theme.
 */
(function () {
  "use strict";

  var TAG = "wwwblogge0295-21";
  var AMAZON = "https://www.amazon.in/s";
  var STYLE_ID = "bw-amazon-affiliate-style";
  var WIDGET_CLASS = "bw-amazon-affiliate";
  var PREF_KEY = "bw_amazon_interest_v1";
  var attempts = 0;
  var retryTimer = null;
  var observer = null;

  var CATEGORIES = {
    books: {
      label: "Books",
      heading: "Books You May Like",
      items: [
        { name: "Biographies and autobiographies", q: "biography autobiography books" },
        { name: "Inspirational and history books", q: "inspirational Indian history books" }
      ]
    },
    mobile: {
      label: "Mobiles",
      heading: "Mobile Phones You May Like",
      items: [
        { name: "Latest smartphones", q: "smartphones latest mobile phones" },
        { name: "Mobile covers and accessories", q: "mobile phone accessories covers chargers" }
      ]
    },
    electronics: {
      label: "Electronics",
      heading: "Electronics You May Like",
      items: [
        { name: "Earbuds and headphones", q: "wireless earbuds headphones" },
        { name: "Smart watches and speakers", q: "smart watches bluetooth speakers" }
      ]
    },
    computers: {
      label: "Computers",
      heading: "Computer Products You May Like",
      items: [
        { name: "Laptops and tablets", q: "laptops tablets" },
        { name: "Computer accessories", q: "keyboard mouse computer accessories" }
      ]
    },
    home: {
      label: "Home",
      heading: "Home Products You May Like",
      items: [
        { name: "Useful home and kitchen items", q: "home kitchen useful products" },
        { name: "Home decoration and lighting", q: "home decoration lights" }
      ]
    },
    fashion: {
      label: "Fashion",
      heading: "Fashion Products You May Like",
      items: [
        { name: "Clothing and footwear", q: "fashion clothing footwear" },
        { name: "Watches and accessories", q: "watches fashion accessories" }
      ]
    }
  };

  function readPreference() {
    try {
      var value = window.localStorage.getItem(PREF_KEY);
      return Object.prototype.hasOwnProperty.call(CATEGORIES, value) ? value : "";
    } catch (e) {
      return "";
    }
  }

  function savePreference(value) {
    try {
      if (Object.prototype.hasOwnProperty.call(CATEGORIES, value)) {
        window.localStorage.setItem(PREF_KEY, value);
        return true;
      }
    } catch (e) {}
    return false;
  }

  function clearPreference() {
    try { window.localStorage.removeItem(PREF_KEY); } catch (e) {}
  }

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = [
      "." + WIDGET_CLASS + "{display:block!important;visibility:visible!important;box-sizing:border-box;width:100%;margin:24px 0;padding:16px;border:1px solid #e4e7eb;border-radius:12px;background:#fff;font-family:Arial,sans-serif;color:#222;clear:both}",
      "." + WIDGET_CLASS + " *{box-sizing:border-box}",
      "." + WIDGET_CLASS + " h3{font-size:18px;line-height:1.35;margin:0 0 8px;color:#232f3e}",
      "." + WIDGET_CLASS + " p{font-size:13px;line-height:1.5;margin:0 0 12px;color:#555}",
      "." + WIDGET_CLASS + " .bw-choices{display:flex;flex-wrap:wrap;gap:7px;margin:12px 0}",
      "." + WIDGET_CLASS + " button.bw-choice,." + WIDGET_CLASS + " button.bw-action{border:1px solid #ccd2d8;border-radius:20px;background:#f7f8fa;color:#222;padding:8px 11px;font-size:12px;cursor:pointer}",
      "." + WIDGET_CLASS + " button.bw-choice[aria-pressed=true]{background:#232f3e;color:#fff;border-color:#232f3e}",
      "." + WIDGET_CLASS + " button.bw-action{border-radius:7px;background:#ffcc66;border-color:#ffcc66;font-weight:bold;margin:0 6px 6px 0}",
      "." + WIDGET_CLASS + " .bw-items{display:flex;flex-wrap:wrap;gap:10px;width:100%}",
      "." + WIDGET_CLASS + " a.bw-item{display:block;flex:1 1 180px;min-width:0;padding:12px;border:1px solid #e5e7eb;border-radius:9px;text-decoration:none!important;background:#fafafa;color:#222}",
      "." + WIDGET_CLASS + " a.bw-item strong{display:block;font-size:14px;line-height:1.4;margin-bottom:9px;color:#222}",
      "." + WIDGET_CLASS + " a.bw-item span{display:inline-block;background:#ffcc66;color:#111;padding:8px 11px;border-radius:6px;font-weight:bold;font-size:13px}",
      "." + WIDGET_CLASS + " .bw-disclosure{font-size:11px;line-height:1.5;color:#666;margin:12px 0 0}",
      "." + WIDGET_CLASS + " .bw-status{font-size:12px;color:#315b37;margin:6px 0}",
      "@media(max-width:600px){." + WIDGET_CLASS + "{width:100%;margin:18px 0;padding:12px}." + WIDGET_CLASS + " .bw-items{display:block}." + WIDGET_CLASS + " a.bw-item{width:100%;margin:0 0 9px;flex:none}." + WIDGET_CLASS + " h3{font-size:17px}}"
    ].join("");
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function findPostBody() {
    var selectors = [".post-body", ".entry-content", ".post-body-container", ".post-content", "article .post-body", ".blog-posts .post .post-body", ".post"];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el && !el.querySelector("." + WIDGET_CLASS)) return el;
    }
    return null;
  }

  function getPostCategory(postBody) {
    var titleEl = document.querySelector("h1.post-title, h1.entry-title, .post-title, .entry-title, h1");
    var title = titleEl ? titleEl.textContent : document.title;
    var body = postBody ? postBody.textContent : "";
    var text = (title + " " + body.slice(0, 2500)).toLowerCase();

    if (/scientist|science|invention|inventor|technology|engineer/.test(text)) return "books";
    if (/history|historical|king|queen|emperor|freedom fighter|war|ancient/.test(text)) return "books";
    if (/festival|diwali|holi|raksha|christmas|eid|navratri|ganesh/.test(text)) return "home";
    if (/politician|president|prime minister|leader|politics|freedom|actor|actress|celebrity|film|movie|bollywood|hollywood|singer|musician/.test(text)) return "books";
    return "books";
  }

  function makeAmazonUrl(query) {
    return AMAZON + "?k=" + encodeURIComponent(query) + "&tag=" + encodeURIComponent(TAG);
  }

  function renderProducts(box, categoryKey) {
    var data = CATEGORIES[categoryKey] || CATEGORIES.books;
    var heading = box.querySelector(".bw-products-heading");
    var items = box.querySelector(".bw-items");
    heading.textContent = data.heading;
    items.textContent = "";

    data.items.forEach(function (item) {
      var link = document.createElement("a");
      link.className = "bw-item";
      link.href = makeAmazonUrl(item.q);
      link.target = "_blank";
      link.rel = "nofollow sponsored noopener";
      var name = document.createElement("strong");
      name.textContent = item.name;
      var button = document.createElement("span");
      button.textContent = "View on Amazon";
      link.appendChild(name);
      link.appendChild(button);
      items.appendChild(link);
    });
  }

  function insertWidget() {
    var postBody = findPostBody();
    if (!postBody) return false;

    var saved = readPreference();
    var current = saved || getPostCategory(postBody);
    var box = document.createElement("section");
    box.className = WIDGET_CLASS;
    box.setAttribute("aria-label", "Amazon product suggestions based on selected interests");

    var heading = document.createElement("h3");
    heading.textContent = "Products You May Like";

    var intro = document.createElement("p");
    intro.textContent = "Apni pasand chuniye. Aapki choice se Amazon par related products ke links dikhenge.";

    var choices = document.createElement("div");
    choices.className = "bw-choices";
    var choiceButtons = {};

    Object.keys(CATEGORIES).forEach(function (key) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bw-choice";
      btn.textContent = CATEGORIES[key].label;
      btn.setAttribute("aria-pressed", key === current ? "true" : "false");
      btn.addEventListener("click", function () {
        current = key;
        Object.keys(choiceButtons).forEach(function (k) {
          choiceButtons[k].setAttribute("aria-pressed", k === current ? "true" : "false");
        });
        renderProducts(box, current);
        status.textContent = "Aapki pasand abhi is page ke liye chuni gayi hai. Ise agali baar ke liye save karne ke liye neeche button dabayein.";
      });
      choiceButtons[key] = btn;
      choices.appendChild(btn);
    });

    var productsHeading = document.createElement("h3");
    productsHeading.className = "bw-products-heading";

    var items = document.createElement("div");
    items.className = "bw-items";

    var actions = document.createElement("div");
    actions.style.marginTop = "12px";
    var saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "bw-action";
    saveBtn.textContent = "Remember my choice on this device";
    saveBtn.addEventListener("click", function () {
      if (savePreference(current)) {
        status.textContent = "Saved on this device. You can change or clear your choice anytime.";
        saveBtn.textContent = "Preference saved";
      } else {
        status.textContent = "Browser storage is unavailable. Your selection will apply only on this page.";
      }
    });

    var clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "bw-action";
    clearBtn.textContent = "Forget my choice";
    clearBtn.addEventListener("click", function () {
      clearPreference();
      current = getPostCategory(postBody);
      Object.keys(choiceButtons).forEach(function (k) {
        choiceButtons[k].setAttribute("aria-pressed", k === current ? "true" : "false");
      });
      renderProducts(box, current);
      saveBtn.textContent = "Remember my choice on this device";
      status.textContent = "Saved preference cleared from this browser.";
    });

    var status = document.createElement("div");
    status.className = "bw-status";
    status.setAttribute("aria-live", "polite");
    status.textContent = saved ? "Aapki pehle save ki hui pasand is device par use ho rahi hai." : "Abhi koi personal preference save nahi hai. Post ke topic ke hisab se suggestions dikh rahe hain.";

    var disclosure = document.createElement("div");
    disclosure.className = "bw-disclosure";
    disclosure.textContent = "Your selected category is stored only in this browser if you choose to save it. We do not read your Amazon browsing history. As an Amazon Associate I earn from qualifying purchases.";

    actions.appendChild(saveBtn);
    actions.appendChild(clearBtn);
    box.appendChild(heading);
    box.appendChild(intro);
    box.appendChild(choices);
    box.appendChild(productsHeading);
    box.appendChild(items);
    box.appendChild(actions);
    box.appendChild(status);
    box.appendChild(disclosure);

    renderProducts(box, current);

    var paragraphs = postBody.querySelectorAll("p");
    if (paragraphs.length >= 2 && paragraphs[1].parentNode) {
      paragraphs[1].parentNode.insertBefore(box, paragraphs[1].nextSibling);
    } else {
      postBody.insertBefore(box, postBody.firstChild);
    }
    return true;
  }

  function stopWatching() {
    if (retryTimer) { window.clearInterval(retryTimer); retryTimer = null; }
    if (observer) { observer.disconnect(); observer = null; }
  }

  function tryInsert() {
    addStyles();
    if (insertWidget()) { stopWatching(); return true; }
    return false;
  }

  function start() {
    if (tryInsert()) return;
    if (window.MutationObserver && document.documentElement) {
      observer = new MutationObserver(function () { tryInsert(); });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
    retryTimer = window.setInterval(function () {
      attempts++;
      if (tryInsert() || attempts >= 40) stopWatching();
    }, 500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
  window.addEventListener("load", tryInsert);
})();