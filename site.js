// Update these 4 fields only.
const PROGRESS = 5;                 // 0-100
const UPDATED = new Date().toISOString().slice(0,10);
const MODEL_URL = "";              // paste link when ready
const MEMO_URL  = "";              // paste link when ready
const COURSE_URL = "";             // optional

document.getElementById("updated").textContent = `Updated: ${UPDATED}`;
document.getElementById("bar").style.width = `${PROGRESS}%`;

const modelLink = document.getElementById("modelLink");
const memoLink  = document.getElementById("memoLink");
const courseLink = document.getElementById("courseLink");

if (MODEL_URL) modelLink.href = MODEL_URL; else modelLink.style.display = "none";
if (MEMO_URL)  memoLink.href  = MEMO_URL;  else memoLink.style.display  = "none";
if (COURSE_URL) courseLink.href = COURSE_URL; else courseLink.style.display = "none";

document.getElementById("status").textContent =
  PROGRESS >= 100 ? "Shipped" : (PROGRESS > 0 ? "In progress" : "Planned");
