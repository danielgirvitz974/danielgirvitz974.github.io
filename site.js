
const PROGRESS = 10; // Adjust as needed

document.getElementById("updated").textContent =
  new Date().toISOString().slice(0,10);

const pct = Math.max(0, Math.min(100, PROGRESS));
document.getElementById("progressBar").style.width = pct + "%";
document.getElementById("progressPct").textContent = pct + "%";

document.getElementById("status").textContent =
  pct >= 100 ? "Completed" : (pct > 0 ? "In Progress" : "Planned");
