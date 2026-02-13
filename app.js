const DATA = [
  {
    id: "integrated-financial-model",
    title: "Integrated 3-Statement Financial Model",
    category: "modeling",
    priority: 1,
    status: "in_progress", // planned | in_progress | shipped
    progress: 5,
    notes:
      "Build a fully integrated Income Statement, Balance Sheet, and Cash Flow model with dynamic drivers, scenario toggles, and error checks. Include debt schedule and working capital sensitivity.",
    courses: [{ label: "Udemy: Advanced Financial Modeling", url: "" }],
    artifacts: [{ label: "Model v1 (Excel)", url: "" }],
  },

  {
    id: "cash-flow-diagnostics",
    title: "Cash Flow & Working Capital Diagnostics",
    category: "finance",
    priority: 2,
    status: "planned",
    progress: 0,
    notes:
      "Analyze AR/AP/inventory cycles and cash runway. Build a 12-month liquidity stress scenario and summarize key levers.",
    courses: [{ label: "Udemy: Working Capital / Cash Flow", url: "" }],
    artifacts: [],
  },

  {
    id: "debt-capital-structure",
    title: "Debt & Capital Structure Analysis",
    category: "finance",
    priority: 2,
    status: "planned",
    progress: 0,
    notes:
      "Model amortization schedules, interest sensitivity, covenant testing and leverage ratios. Understand refinancing options.",
    courses: [{ label: "Udemy: Credit / Debt Modeling", url: "" }],
    artifacts: [],
  },

  {
    id: "valuation-framework",
    title: "Valuation Framework (DCF + Multiples)",
    category: "finance",
    priority: 3,
    status: "planned",
    progress: 0,
    notes:
      "Build DCF from modeled cash flows. Cross-check with trading comps. Sensitivity grid on WACC and growth assumptions.",
    courses: [{ label: "Udemy: Valuation (DCF & Comps)", url: "" }],
    artifacts: [],
  },

  {
    id: "operator-memo-writing",
    title: "Operator Memo Writing",
    category: "comms",
    priority: 2,
    status: "planned",
    progress: 0,
    notes:
      "Write concise executive memos: diagnosis → risk → options → recommendation. Neutral tone, board-readable structure.",
    courses: [{ label: "Udemy: Executive Writing / Business Writing", url: "" }],
    artifacts: [{ label: "Memo Template (Google Doc/PDF)", url: "" }],
  },

  // Keep these so your filter tabs don't go dead.
  {
    id: "risk-controls-basics",
    title: "Risk & Controls Basics (Controls Thinking)",
    category: "risk",
    priority: 3,
    status: "planned",
    progress: 0,
    notes:
      "Basic controls vocabulary and control-failure narratives. Enough to read audit reports and write clean findings.",
    courses: [{ label: "Udemy: Internal Audit / Controls", url: "" }],
    artifacts: [],
  },

  {
    id: "sql-financial-analysis",
    title: "SQL for Financial Analysis",
    category: "data",
    priority: 3,
    status: "planned",
    progress: 0,
    notes:
      "Queries + joins + window functions for KPI tables and financial datasets. Build a small repo of reusable patterns.",
    courses: [{ label: "Udemy: SQL for Analysts", url: "" }],
    artifacts: [{ label: "SQL Snippets Repo", url: "" }],
  },

  {
    id: "turnaround-diagnostics-playbook",
    title: "Turnaround Diagnostics Playbook",
    category: "ops",
    priority: 2,
    status: "planned",
    progress: 0,
    notes:
      "A repeatable framework: symptoms → root cause → interventions → governance → metrics. Build as a living document.",
    courses: [{ label: "Udemy: Turnaround / Restructuring", url: "" }],
    artifacts: [{ label: "Playbook v1 (PDF)", url: "" }],
  },
];

const elGrid = document.getElementById("grid");
const elStats = document.getElementById("stats");
const elSearch = document.getElementById("search");
const elSort = document.getElementById("sort");
const chips = [...document.querySelectorAll(".chip")];
const elUpdated = document.getElementById("lastUpdated");

let activeFilter = "all";
let query = "";

function statusBadge(status) {
  if (status === "shipped") return `<span class="badge ok">Shipped</span>`;
  if (status === "in_progress") return `<span class="badge warn">In progress</span>`;
  return `<span class="badge">Planned</span>`;
}

function prettyCategory(c) {
  return (
    {
      finance: "Finance",
      modeling: "Modeling",
      risk: "Risk & Audit",
      data: "Data",
      ops: "Ops & Turnaround",
      comms: "Comms",
    }[c] || c
  );
}

function score(item) {
  // higher score = higher rank
  const s = { shipped: 1, in_progress: 2, planned: 3 }[item.status] ?? 9;
  return (10 - item.priority) * 1000 + item.progress * 10 - s;
}

function render() {
  const now = new Date();
  elUpdated.textContent = `Updated: ${now.toISOString().slice(0, 10)}`;

  let items = DATA.slice();

  if (activeFilter !== "all") {
    items = items.filter((i) => i.category === activeFilter);
  }
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    items = items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.notes.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    );
  }

  const sortBy = elSort.value;
  items.sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "progress") return b.progress - a.progress;
    if (sortBy === "status") return a.status.localeCompare(b.status);
    // default: priority-ish composite
    return score(b) - score(a);
  });

  // stats
  const total = DATA.length;
  const shipped = DATA.filter((d) => d.status === "shipped").length;
  const inprog = DATA.filter((d) => d.status === "in_progress").length;
  const avg = Math.round(
    DATA.reduce((s, d) => s + d.progress, 0) / Math.max(1, total)
  );
  elStats.innerHTML = `
    <div class="stat"><div class="k">Total items</div><div class="v">${total}</div></div>
    <div class="stat"><div class="k">Shipped</div><div class="v">${shipped}</div></div>
    <div class="stat"><div class="k">In progress</div><div class="v">${inprog}</div></div>
    <div class="stat"><div class="k">Avg progress</div><div class="v">${avg}%</div></div>
  `;

  // cards
  elGrid.innerHTML = items
    .map((item) => {
      const bar = `<div class="progress"><div style="width:${item.progress}%"></div></div>`;
      const courses = (item.courses || [])
        .filter((c) => c.label)
        .map((c) => {
          const url = c.url?.trim();
          return url
            ? `<a href="${url}" target="_blank" rel="noreferrer">${c.label}</a>`
            : `<span class="tag">${c.label}</span>`;
        })
        .join(" • ");

      const artifacts = (item.artifacts || [])
        .filter((a) => a.label)
        .map((a) => {
          const url = a.url?.trim();
          return url
            ? `<a href="${url}" target="_blank" rel="noreferrer">${a.label}</a>`
            : `<span class="tag">${a.label}</span>`;
        })
        .join(" • ");

      return `
      <article class="card">
        <div class="row">
          <div>
            <h3 class="title">${item.title}</h3>
            <div class="tag">${prettyCategory(item.category)} • Priority ${item.priority}</div>
          </div>
          ${statusBadge(item.status)}
        </div>
        ${bar}
        <div class="small">${item.notes}</div>
        ${(courses || artifacts)
          ? `
          <div class="links">
            ${courses ? `<span class="tag">Courses:</span> ${courses}` : ""}
            ${artifacts ? `<span class="tag">Artifacts:</span> ${artifacts}` : ""}
          </div>
        `
          : ""}
      </article>
    `;
    })
    .join("");
}

chips.forEach((btn) => {
  btn.addEventListener("click", () => {
    chips.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    render();
  });
});

elSearch.addEventListener("input", (e) => {
  query = e.target.value;
  render();
});

elSort.addEventListener("change", render);

render();
