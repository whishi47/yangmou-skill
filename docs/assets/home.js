/* Home page scripts for the yangmou static atlas. */

async function hydrateStats() {
  try {
    const data = await window.yangmou.loadCases();
    const cases = data.cases || [];
    const books = new Set(cases.map(c => c.book).filter(Boolean));
    const statCases = document.getElementById("stat-cases");
    const statBooks = document.getElementById("stat-books");
    if (statCases) statCases.textContent = String(cases.length);
    if (statBooks) statBooks.textContent = String(books.size);
    return { cases, books };
  } catch (err) {
    return { cases: [], books: new Set() };
  }
}

function renderBooks(books) {
  const list = document.getElementById("book-list");
  if (!list) return;
  const langs = window.yangmou.getLang();
  const booksArr = [...books].sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  if (!booksArr.length) {
    list.innerHTML = "";
    return;
  }
  list.innerHTML = booksArr.map(book => {
    const query = encodeURIComponent(book);
    const link = `gallery.html?book=${query}`;
    const label = langs === "en" && window.yangmouBookLabels[book] ? window.yangmouBookLabels[book] : book;
    return `<a class="book-link" href="${link}">${escapeHtml(label)}</a>`;
  }).join("");
}

function setupLang() {
  const toggle = window.yangmou.createLangToggle();
  const nav = document.querySelector(".nav");
  if (nav) nav.appendChild(toggle);
  window.afterLangChange = () => {
    const data = window.__yangmouHomeData;
    if (data) renderBooks(data.books);
  };
}

async function init() {
  window.yangmou.setLang(window.yangmou.getLang());
  setupLang();
  const data = await hydrateStats();
  window.__yangmouHomeData = data;
  renderBooks(data.books);
}

init();
