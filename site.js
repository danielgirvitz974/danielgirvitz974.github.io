// Update only these fields.
const PROGRESS = 10;        // 0–100
const MODEL_URL = "";       // add link when uploaded
const MEMO_URL  = "";       // add link when uploaded

document.getElementById("updated").textContent =
  new Date().toISOString().slice(0,10);

const pct = Math.max(0, Math.min(100, PROGRESS));
document.getElementById("progressBar").style.width = pct + "%";
document.getElementById("progressPct").textContent = pct + "%";

document.getElementById("status").textContent =
  pct >= 100 ? "Completed" : (pct > 0 ? "In progress" : "Planned");

const modelLink = document.getElementById("modelLink");
const memoLink  = document.getElementById("memoLink");
const hint = document.getElementById("artifactHint");

let shown = 0;
if (MODEL_URL) { modelLink.href = MODEL_URL; shown++; } else { modelLink.style.display = "none"; }
if (MEMO_URL)  { memoLink.href  = MEMO_URL;  shown++; } else { memoLink.style.display = "none"; }
if (shown > 0) hint.style.display = "none";
