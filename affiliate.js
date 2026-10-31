/* Amazon Affiliate Auto Widget for Blogger
 * Associate tag: wwwblogge0295-21
 * Uses Amazon India search links (no API, no fabricated prices/images).
 * Add this script once to Blogger just before </body>.
 */
(function () {
  "use strict";
  var TAG = "wwwblogge0295-21";
  var AMAZON = "https://www.amazon.in/s";
  var STYLE_ID = "bw-amazon-affiliate-style";
  var WIDGET_CLASS = "bw-amazon-affiliate";

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = [
      "." + WIDGET_CLASS + "{box-sizing:border-box;margin:24px 0;padding:16px;border:1px solid #e4e7eb;border-radius:12px;background:#fff;font-family:Arial,sans-serif;color:#222}",
      "." + WIDGET_CLASS + " *{box-sizing:border-box}",
      "." + WIDGET_CLASS + " h3{font-size:18px;margin:0 0 8px;color:#232f3e}",
      "." + WIDGET_CLASS + " p{font-size:13px;line-height:1.5;margin:0 0 12px;color:#555}",
      "." + WIDGET_CLASS + " .bw-items{display:flex;flex-wrap:wrap;gap:10px}",
      "." + WIDGET_CLASS + " a.bw-item{display:inline-block;flex:1 1 180px;min-width:0;padding:12px;border:1px solid #e5e7eb;border-radius:9px;text-decoration:none!important;background:#fafafa;color:#222}",
      "." + WIDGET_CLASS + " a.bw-item strong{display:block;font-size:14px;line-height:1.4;margin-bottom:9px}",
      "." + WIDGET_CLASS + " a.bw-item span{display:inline-block;background:#ffcc66;color:#111;padding:8px 11px;border-radius:6px;font-weight:bold;font-size:13px}",
      "." + WIDGET_CLASS + " .bw-disclosure{font-size:11px;color:#666;margin:12px 0 0}",
      "@media(max-width:480px){." + WIDGET_CLASS + "{padding:12px}." + WIDGET_CLASS + " a.bw-item{flex-basis:100%}}"
    ].join("");
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function getSearchTerms() {
    var title = (document.querySelector("h1.post-title, h1.entry-title, .post-title, .entry-title") || {}).textContent || document.title || "";
    var body = (document.querySelector(".post-body, .entry-content, article") || {}).textContent || "";
    var text = (title + " " + body.slice(0, 1800)).toLowerCase();

    if (/actor|actress|celebrity|film|movie|bollywood|hollywood|singer|musician/.test(text)) {
      return {
        heading: "Related Books & Biography Reads",
        items: [
          { name: "Celebrity biographies and life stories", q: "celebrity biography books" },
          { name: "Film, music and entertainment books", q: "film music entertainment books" }
        ]
      };
    }
    if (/scientist|science|invention|inventor|technology|engineer/.test(text)) {
      return {
        heading: "Books About Science & Great Thinkers",
        items: [
          { name: "Science and scientist biographies", q: "science biographies books" },
          { name: "Inventions and technology books", q: "inventions technology books" }
        ]
      };
    }
    if (/history|historical|king|queen|emperor|freedom fighter|war|ancient/.test(text)) {
      return {
        heading: "History Books & Biographies",
        items: [
          { name: "Indian history books", q: "Indian history books" },
          { name: "Historical biographies", q: "historical biography books" }
        ]
      };
    }
    if (/festival|diwali|holi|raksha|christmas|eid|navratri|ganesh/.test(text)) {
      return {
        heading: "Festival Books & Celebration Essentials",
        items: [
          { name: "Festival and culture books", q: "Indian festivals culture books" },
          { name: "Festival decoration ideas and items", q: "festival home decoration" }
        ]
      };
    }
    if (/politician|president|prime minister|leader|politics|freedom/.test(text)) {
      return {
        heading: "Books About Leaders & Public Figures",
        items: [
          { name: "Political biographies", q: "political biographies books" },
          { name: "Leadership and inspirational books", q: "leadership inspirational books" }
        ]
      };
    }
    return {
      heading: "Biography Books & Inspirational Reads",
      items: [
        { name: "Biography and autobiography books", q: "biography autobiography books" },
        { name: "Inspirational life stories", q: "inspirational life story books" }
      ]
    };
  }

  function makeAmazonUrl(query) {
    return AMAZON + "?k=" + encodeURIComponent(query) + "&tag=" + encodeURIComponent(TAG);
  }

  function insertWidget() {
    var postBody = document.querySelector(".post-body, .entry-content, article .post-body");
    if (!postBody || postBody.querySelector("." + WIDGET_CLASS)) return;
    if (!document.querySelector(".post-title, .entry-title, h1")) return;

    var data = getSearchTerms();
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
  }

  function start() {
    addStyles();
    insertWidget();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();