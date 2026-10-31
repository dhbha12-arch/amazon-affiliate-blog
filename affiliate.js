/* Amazon Affiliate Auto Widget for Blogger - Desktop + Mobile
 * Amazon India Associate tag: wwwblogge0295-21
 * Uses Amazon search links; no API, scraping, fabricated prices or images.
 * Add this script once before </body> in the Blogger theme.
 */
(function () {
  "use strict";

  var TAG = "wwwblogge0295-21";
  var AMAZON = "https://www.amazon.in/s";
  var STYLE_ID = "bw-amazon-affiliate-style";
  var WIDGET_CLASS = "bw-amazon-affiliate";
  var attempts = 0;
  var retryTimer = null;
  var observer = null;

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = [
      "." + WIDGET_CLASS + "{display:block!important;visibility:visible!important;box-sizing:border-box;width:100%;margin:24px 0;padding:16px;border:1px solid #e4e7eb;border-radius:12px;background:#fff;font-family:Arial,sans-serif;color:#222;clear:both}",
      "." + WIDGET_CLASS + " *{box-sizing:border-box}",
      "." + WIDGET_CLASS + " h3{font-size:18px;line-height:1.35;margin:0 0 8px;color:#232f3e}",
      "." + WIDGET_CLASS + " p{font-size:13px;line-height:1.5;margin:0 0 12px;color:#555}",
      "." + WIDGET_CLASS + " .bw-items{display:flex;flex-wrap:wrap;gap:10px;width:100%}",
      "." + WIDGET_CLASS + " a.bw-item{display:block;flex:1 1 180px;min-width:0;padding:12px;border:1px solid #e5e7eb;border-radius:9px;text-decoration:none!important;background:#fafafa;color:#222}",
      "." + WIDGET_CLASS + " a.bw-item strong{display:block;font-size:14px;line-height:1.4;margin-bottom:9px;color:#222}",
      "." + WIDGET_CLASS + " a.bw-item span{display:inline-block;background:#ffcc66;color:#111;padding:8px 11px;border-radius:6px;font-weight:bold;font-size:13px}",
      "." + WIDGET_CLASS + " .bw-disclosure{font-size:11px;line-height:1.4;color:#666;margin:12px 0 0}",
      "@media(max-width:600px){." + WIDGET_CLASS + "{width:100%;margin:18px 0;padding:12px}." + WIDGET_CLASS + " .bw-items{display:block}." + WIDGET_CLASS + " a.bw-item{width:100%;margin:0 0 9px;flex:none}." + WIDGET_CLASS + " h3{font-size:17px}}"
    ].join("");
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function findPostBody() {
    var selectors = [
      ".post-body",
      ".entry-content",
      ".post-body-container",
      ".post-content",
      "article .post-body",
      ".blog-posts .post .post-body",
      ".post"
    ];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el && !el.querySelector("." + WIDGET_CLASS)) return el;
    }
    return null;
  }

  function getSearchTerms(postBody) {
    var titleEl = document.querySelector("h1.post-title, h1.entry-title, .post-title, .entry-title, h1");
    var title = titleEl ? titleEl.textContent : document.title;
    var body = postBody ? postBody.textContent : "";
    var text = (title + " " + body.slice(0, 2500)).toLowerCase();

    if (/actor|actress|celebrity|film|movie|bollywood|hollywood|singer|musician/.test(text)) {
      return { heading: "Related Books & Biography Reads", items: [
        { name: "Celebrity biographies and life stories", q: "celebrity biography books" },
        { name: "Film, music and entertainment books", q: "film music entertainment books" }
      ]};
    }
    if (/scientist|science|invention|inventor|technology|engineer/.test(text)) {
      return { heading: "Books About Science & Great Thinkers", items: [
        { name: "Science and scientist biographies", q: "science biographies books" },
        { name: "Inventions and technology books", q: "inventions technology books" }
      ]};
    }
    if (/history|historical|king|queen|emperor|freedom fighter|war|ancient/.test(text)) {
      return { heading: "History Books & Biographies", items: [
        { name: "Indian history books", q: "Indian history books" },
        { name: "Historical biographies", q: "historical biography books" }
      ]};
    }
    if (/festival|diwali|holi|raksha|christmas|eid|navratri|ganesh/.test(text)) {
      return { heading: "Festival Books & Celebration Essentials", items: [
        { name: "Festival and culture books", q: "Indian festivals culture books" },
        { name: "Festival decoration ideas and items", q: "festival home decoration" }
      ]};
    }
    if (/politician|president|prime minister|leader|politics|freedom/.test(text)) {
      return { heading: "Books About Leaders & Public Figures", items: [
        { name: "Political biographies", q: "political biographies books" },
        { name: "Leadership and inspirational books", q: "leadership inspirational books" }
      ]};
    }
    return { heading: "Biography Books & Inspirational Reads", items: [
      { name: "Biography and autobiography books", q: "biography autobiography books" },
      { name: "Inspirational life stories", q: "inspirational life story books" }
    ]};
  }

  function makeAmazonUrl(query) {
    return AMAZON + "?k=" + encodeURIComponent(query) + "&tag=" + encodeURIComponent(TAG);
  }

  function insertWidget() {
    var postBody = findPostBody();
    if (!postBody) return false;

    var data = getSearchTerms(postBody);
    var box = document.createElement("section");
    box.className = WIDGET_CLASS;
    box.setAttribute("aria-label", "Related Amazon products");

    var heading = document.createElement("h3");
    heading.textContent = data.heading;

    var intro = document.createElement("p");
    intro.textContent = "Explore related books and useful items on Amazon India.";

    var items = document.createElement("div");
    items.className = "bw-items";

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

    var disclosure = document.createElement("div");
    disclosure.className = "bw-disclosure";
    disclosure.textContent = "As an Amazon Associate I earn from qualifying purchases.";

    box.appendChild(heading);
    box.appendChild(intro);
    box.appendChild(items);
    box.appendChild(disclosure);

    var paragraphs = postBody.querySelectorAll("p");
    if (paragraphs.length >= 2 && paragraphs[1].parentNode) {
      paragraphs[1].parentNode.insertBefore(box, paragraphs[1].nextSibling);
    } else {
      postBody.insertBefore(box, postBody.firstChild);
    }
    return true;
  }

  function stopWatching() {
    if (retryTimer) {
      window.clearInterval(retryTimer);
      retryTimer = null;
    }
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function tryInsert() {
    addStyles();
    if (insertWidget()) {
      stopWatching();
      return true;
    }
    return false;
  }

  function start() {
    if (tryInsert()) return;

    // Blogger mobile layouts can render the post body after the initial page load.
    if (window.MutationObserver && document.documentElement) {
      observer = new MutationObserver(function () {
        tryInsert();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    retryTimer = window.setInterval(function () {
      attempts++;
      if (tryInsert() || attempts >= 40) stopWatching();
    }, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
  window.addEventListener("load", tryInsert);
})();