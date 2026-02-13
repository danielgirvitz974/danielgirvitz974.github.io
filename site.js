const PROGRESS = 5;  // 0–100
const MODEL_URL = "";
const MEMO_URL = "";

document.getElementById("updated").textContent =
  "Last updated: " + new Date().toISOString().slice(0, 10);

document.getElementById("progress-bar").style.width = PROGRESS + "%";

document.getElementById("status").textContent =
  PROGRESS >= 100 ? "Completed" : "In progress";

if (!MODEL_URL) document.getElementById("modelLink").style.display = "none";
else document.getElementById("modelLink").href = MODEL_URL;

if (!MEMO_URL) document.getElementById("memoLink").style.display = "none";
else document.getElementById("memoLink").href = MEMO_URL;
