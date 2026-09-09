/* Gallery page scripts for the yangmou static atlas. */

const VALID_FIELDS = ["销售", "营销", "管理", "职场", "投资", "产品", "谈判"];
const DETAIL_LABELS = {
  source_text: { zh: "原文", en: "Source text" },
  background: { zh: "背景", en: "Background" },
  lock_mechanism: { zh: "锁死机制", en: "Lock mechanism" },
  open_move: { zh: "明牌动作", en: "Open move" },
  outcome: { zh: "结果", en: "Outcome" },
  transfer_models: { zh: "通用迁移", en: "General transfer" },
  sales_transfer: { zh: "销售翻译", en: "Sales translation" },
  fields: { zh: "七领域", en: "Seven domains" },
};
const FIELD_LABELS = {
  "销售": "Sales",
  "营销": "Marketing",
  "管理": "Management",
  "职场": "Workplace",
  "投资": "Investing",
  "产品": "Product",
  "谈判": "Negotiation",
};
const PILLAR_LABELS = {
  "规则": "Rules",
  "人性": "Human nature",
  "大势": "Trend",
};
const TYPE_LABELS = {
  "历史": "History",
  "原典": "Classic source",
  "商业": "Business",
};

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name) || "";
}

function setOpenState(id, open) {
  const el = document.getElementById(id);
  if (el && el.tagName === "DETAILS") {
    if (open) el.setAttribute("open", "");
    else el.removeAttribute("open");
  }
}

function formatter(lang, zh, en) {
  return lang === "en" ? en : zh;
}

function updateMeta(count, total) {
  const meta = document.querySelector(".gallery-meta");
  if (!meta) return;
  const lang = window.yangmou.getLang();
  meta.textContent = formatter(lang, `显示 ${count} / ${total} 条案例`, `${count} / ${total} cases`);
}

function updateUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.field) params.set("field", state.field);
  if (state.pillar) params.set("pillar", state.pillar);
  if (state.book) params.set("book", state.book);
  if (state.type) params.set("type", state.type);
  const qs = params.toString();
  const hash = window.location.hash;
  const target = `${window.location.pathname}${qs ? `?${qs}` : ""}${hash}`;
  history.replaceState(null, "", target);
}

function stateFromUrl() {
  return {
    query: getParam("q"),
    field: getParam("field"),
    pillar: getParam("pillar"),
    book: getParam("book"),
    type: getParam("type"),
  };
}

function detailBlock(title, value, lang) {
  if (!value) return "";
  return `<div class="detail-block"><h4>${escapeHtml(title)}</h4><p>${escapeHtml(value)}</p></div>`;
}

function renderCaseCard(caseItem) {
  const lang = window.yangmou.getLang();
  const en = lang === "en" ? (window.YANGMOU_CASES_EN || {})[caseItem.id] : null;
  const name = en && en.name ? en.name : caseItem.name;
  const summary = en && en.summary ? en.summary : caseItem.summary;
  const bookName = lang === "en" && window.yangmouBookLabels[caseItem.book] ? window.yangmouBookLabels[caseItem.book] : caseItem.book;
  const label = (key) => escapeHtml(DETAIL_LABELS[key][lang] || DETAIL_LABELS[key].zh);
  const fieldName = (key) => escapeHtml(FIELD_LABELS[key] || key);
  const pillarName = (p) => escapeHtml(PILLAR_LABELS[p] || p);
  const pillars = (caseItem.pillars || []).map(p => `<span class="${window.yangmou.pillarClass(p)}">${pillarName(p)}</span>`).join("");
  const tags = (caseItem.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join("<span class=\"tag-sep\">·</span>");
  const fields = Object.entries(caseItem.fields || {}).map(([key, value]) => `<div class="field-box"><h5>${fieldName(key)}</h5><p>${escapeHtml(value)}</p></div>`).join("");
  const source = caseItem.source_url ? `<p class="source-link"><a href="${escapeHtml(caseItem.source_url)}" target="_blank" rel="noopener">${escapeHtml(caseItem.source_url)}</a></p>` : "";
  const sourceText = caseItem.source_text && lang === "zh" ? `<div class="detail-block"><h4>${label("source_text")}</h4><blockquote>${escapeHtml(caseItem.source_text)}</blockquote></div>` : "";

  return `<details class="case-card" id="${escapeHtml(caseItem.id)}">
    <summary class="case-card-summary">
      <div class="case-kicker">
        <span class="type">${escapeHtml(lang === "en" ? TYPE_LABELS[caseItem.type] || caseItem.type : caseItem.type)}</span>
        <span>${escapeHtml(caseItem.era || "")}</span>
        <span>${escapeHtml(bookName || (lang === "en" ? "Business case" : "商业案例"))}</span>
      </div>
      <h3>${escapeHtml(name)}</h3>
      <p class="summary">${escapeHtml(summary)}</p>
      <div class="pillar-row">${pillars}</div>
      ${lang === "zh" && tags ? `<div class="tag-row">${tags}</div>` : ""}
    </summary>
    <div class="details-body">
      ${detailBlock(label("background"), caseItem.background)}
      ${detailBlock(label("lock_mechanism"), caseItem.lock_mechanism)}
      ${detailBlock(label("open_move"), caseItem.open_move)}
      ${detailBlock(label("outcome"), caseItem.outcome)}
      ${detailBlock(label("transfer_models"), caseItem.transfer_models)}
      ${detailBlock(label("sales_transfer"), caseItem.sales_transfer)}
      ${fields ? `<div class="detail-block"><h4>${label("fields")}</h4><div class="field-grid">${fields}</div></div>` : ""}
      ${sourceText}
      ${source}
    </div>
  </details>`;
}

function render() {
  const grid = document.getElementById("case-grid");
  if (!grid) return;
  const results = window.yangmou.filterCases(allCases, { ...state, query: state.query });
  if (!results.length) {
    grid.innerHTML = `<div class="empty-state">${escapeHtml(window.yangmou.I18N.no_results[window.yangmou.getLang()])}</div>`;
    updateMeta(0, allCases.length);
    return;
  }
  grid.innerHTML = results.map(renderCaseCard).join("");
  updateMeta(results.length, allCases.length);
  handleHash(false);
}

function populateSelect(selectId, values) {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = `<option value="">${escapeHtml(window.yangmou.I18N.all[window.yangmou.getLang()])}</option>`;
  const lang = window.yangmou.getLang();
  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    const label = lang === "en"
      ? (FIELD_LABELS[value] || TYPE_LABELS[value] || PILLAR_LABELS[value] || value)
      : value;
    option.textContent = lang === "en" && window.yangmouBookLabels[value] ? window.yangmouBookLabels[value] : label;
    select.appendChild(option);
  });
}

function populateOptions() {
  const fieldValues = VALID_FIELDS.filter(f => allCases.some(c => c.fields && c.fields[f]));
  const bookValues = [...new Set(allCases.map(c => c.book).filter(Boolean))].sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  const typeValues = [...new Set(allCases.map(c => c.type).filter(Boolean))].sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  populateSelect("pillar-filter", ["规则", "人性", "大势"]);
  populateSelect("field-filter", fieldValues);
  populateSelect("book-filter", bookValues);
  populateSelect("type-filter", typeValues);
  applyStateToControls();
}

function applyStateToControls() {
  const queryInput = document.getElementById("query");
  const field = document.getElementById("field-filter");
  const pillar = document.getElementById("pillar-filter");
  const book = document.getElementById("book-filter");
  const type = document.getElementById("type-filter");
  if (queryInput) queryInput.value = state.query || "";
  if (field) field.value = state.field || "";
  if (pillar) pillar.value = state.pillar || "";
  if (book) book.value = state.book || "";
  if (type) type.value = state.type || "";
}

function bindControls() {
  const searchForm = document.getElementById("gallery-search");
  if (searchForm) {
    searchForm.addEventListener("submit", event => {
      event.preventDefault();
      state.query = document.getElementById("query").value.trim();
      render();
      updateUrl();
    });
  }

  const queryInput = document.getElementById("query");
  if (queryInput) queryInput.addEventListener("input", () => {
    window.clearTimeout(window.__galleryQueryTimer);
    window.__galleryQueryTimer = window.setTimeout(() => {
      state.query = queryInput.value.trim();
      render();
      updateUrl();
    }, 160);
  });

  const field = document.getElementById("field-filter");
  const pillar = document.getElementById("pillar-filter");
  const book = document.getElementById("book-filter");
  const type = document.getElementById("type-filter");
  const clear = document.getElementById("clear-filters");

  if (field) field.addEventListener("change", event => {
    state.field = event.target.value;
    render();
    updateUrl();
  });
  if (pillar) pillar.addEventListener("change", event => {
    state.pillar = event.target.value;
    render();
    updateUrl();
  });
  if (book) book.addEventListener("change", event => {
    state.book = event.target.value;
    render();
    updateUrl();
  });
  if (type) type.addEventListener("change", event => {
    state.type = event.target.value;
    render();
    updateUrl();
  });

  if (clear) clear.addEventListener("click", () => {
    state = { query: "", field: "", pillar: "", book: "", type: "" };
    if (queryInput) queryInput.value = "";
    applyStateToControls();
    render();
    updateUrl();
  });
}

function handleHash(shouldScroll) {
  const raw = window.location.hash.slice(1);
  if (!raw) return;
  const id = decodeURIComponent(raw);
  setOpenState(id, true);
  if (shouldScroll === false) return;
  const el = document.getElementById(id);
  if (el && el.scrollIntoView) {
    window.setTimeout(() => el.scrollIntoView({ block: "start" }), 80);
  }
}

function setupLang() {
  const nav = document.querySelector(".nav");
  const toggle = window.yangmou.createLangToggle();
  nav.appendChild(toggle);
  window.afterLangChange = () => {
    populateSelect("pillar-filter", ["规则", "人性", "大势"]);
    populateSelect("field-filter", VALID_FIELDS.filter(f => allCases.some(c => c.fields && c.fields[f])));
    populateSelect("book-filter", [...new Set(allCases.map(c => c.book).filter(Boolean))].sort((a, b) => a.localeCompare(b, "zh-Hans-CN")));
    populateSelect("type-filter", [...new Set(allCases.map(c => c.type).filter(Boolean))].sort((a, b) => a.localeCompare(b, "zh-Hans-CN")));
    applyStateToControls();
    render();
  };
}

let state = stateFromUrl();
let allCases = [];

async function init() {
  window.yangmou.setLang(window.yangmou.getLang());
  setupLang();
  bindControls();
  try {
    const data = await window.yangmou.loadCases();
    allCases = data.cases || [];
  } catch (err) {
    const grid = document.getElementById("case-grid");
    grid.innerHTML = `<div class="empty-state">无法加载案例数据</div>`;
    updateMeta(0, 0);
    return;
  }
  populateOptions();
  render();
  handleHash(true);
  window.addEventListener("hashchange", () => handleHash(true));
}

init();
