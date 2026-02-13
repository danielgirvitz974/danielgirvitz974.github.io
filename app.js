const DATA = [
  // Finance / Restructuring core
  {
    id: "three-statement-model",
    title: "3-Statement Financial Modeling",
    category: "modeling",
    priority: 1,
    status: "in_progress", // planned | in_progress | shipped
    progress: 35,
    notes: "Build an integrated IS/BS/CF model with checks, scenarios, and sensitivity table.",
    courses: [
      { label: "Udemy: Financial Modeling", url: "" }
    ],
    artifacts: [
      { label: "Model Template (xlsx)", url: "" }
    ]
  },
  {
    id: "cashflow-working-capital",
    title: "Working Capital & Cash Conversion",
    category: "finance",
    priority: 2,
    status: "planned",
    progress: 0,
    notes: "Understand AR/AP/inventory levers; build quick cash runway model.",
    courses: [{ label: "Udemy: Working Capital", url: "" }],
    artifacts: []
  },
  {
    id: "turnaround-playbook",
    title: "Turnaround Diagnostics Playbook",
    category: "ops",
    priority: 1,
    status: "planned",
    progress: 0,
    notes: "A repeatable framework: symptoms → root cause → interventions → metrics → governance.",
    courses: [{ label: "Udemy: Turnaround/Restructuring", url: "" }],
    artifacts: [{ label: "Playbook (PDF)", url: "" }]
  },

  // Risk / Audit
  {
    id: "risk-controls",
    title: "Risk, Controls, and Audit Basics",
    category: "risk",
    priority: 2,
    status: "in_progress",
    progress: 20,
    notes: "COSO-ish thinking, control testing logic, evidence quality, control failure narratives.",
    courses: [{ label: "Udemy: Internal Audit", url: "" }],
    artifacts: []
  },

  // Data
  {
    id: "sql-for-analysis",
    title: "SQL for Business Analysis",
    category: "data",
    priority: 3,
    status: "shipped",
    progress: 100,
    notes: "Queries, joins, window functions, basic performance hygiene.",
    courses: [],
    artifacts: [{ label: "SQL snippets repo", url: "" }]
  },

  // Comms
  {
    id: "exec-memos",
    title: "Executive Memos & Board-Ready Writing",
    category: "comms",
    priority: 2,
    status: "planned",
    progress: 0,
    notes: "Write like a governance operator: neutral tone, clear thresholds, risk/option framing.",
    courses: [{ label: "Udemy: Business Writing", url: "" }],
    artifacts: []
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

function statusBadge(status){
  if(status === "shipped") return `<span class="badge ok">Shipped</span>`;
  if(status === "in_progress") return `<span class="badge warn">In progress</span>`;
  return `<span class="badge">Planned</span>`;
}

function prettyCategory(c){
  return ({
    finance:"Finance",
    modeling:"Modeling",
    risk:"Risk & Audit",
    data:"Data",
    ops:"Ops & Turnaround",
    comms:"Comms"
  })[c] || c;
}

function score(item){
  // higher score = higher rank
  const s = { shipped: 1, in_progress: 2, planned: 3 }[item.status] ?? 9;
  return (10 - item.priority) * 1000 + (item.progress) * 10 - s;
}

function render(){
  const now = new Date();
  elUpdated.textContent = `Updated: ${now.toISOString().slice(0,10)}`;

  let items = DATA.slice();

  if(activeFilter !== "all"){
    items = items.filter(i => i.category === activeFilter);
  }
  if(query.trim()){
    const q = query.trim().toLowerCase();
    items = items.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.notes.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    );
  }

  const sortBy = elSort.value;
  items.sort((a,b) => {
    if(sortBy === "title") return a.title.localeCompare(b.title);
    if(sortBy === "progress") return (b.progress - a.progress);
    if(sortBy === "status") return (a.status.localeCompare(b.status));
    // default: priority-ish composite
    return score(b) - score(a);
  });

  // stats
  const total = DATA.length;
  const shipped = DATA.filter(d => d.status === "shipped").length;
  const inprog = DATA.filter(d => d.status === "in_progress").length;
  const avg = Math.round(DATA.reduce((s,d)=>s+d.progress,0)/Math.max(1,total));
  elStats.innerHTML = `
    <div class="stat"><div class="k">Total items</div><div class="v">${total}</div></div>
    <div class="stat"><div class="k">Shipped</div><div class="v">${shipped}</div></div>
    <div class="stat"><div class="k">In progress</div><div class="v">${inprog}</div></div>
    <div class="stat"><div class="k">Avg progress</div><div class="v">${avg}%</div></div>
  `;

  // cards
  elGrid.innerHTML = items.map(item => {
    const bar = `<div class="progress"><div style="width:${item.progress}%"></div></div>`;
    const courses = (item.courses||[]).filter(c=>c.label).map(c=>{
      const url = c.url?.trim();
      return url ? `<a href="${url}" target="_blank" rel="noreferrer">${c.label}</a>` : `<span class="tag">${c.label}</span>`;
    }).join(" • ");

    const artifacts = (item.artifacts||[]).filter(a=>a.label).map(a=>{
      const url = a.url?.trim();
      return url ? `<a href="${url}" target="_blank" rel="noreferrer">${a.label}</a>` : `<span class="tag">${a.label}</span>`;
    }).join(" • ");

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
        ${(courses || artifacts) ? `
          <div class="links">
            ${courses ? `<span class="tag">Courses:</span> ${courses}` : ""}
            ${artifacts ? `<span class="tag">Artifacts:</span> ${artifacts}` : ""}
          </div>
        ` : ""}
      </article>
    `;
  }).join("");
}

chips.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    chips.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    render();
  });
});

elSearch.addEventListener("input", (e)=>{
  query = e.target.value;
  render();
});

elSort.addEventListener("change", render);

render();
