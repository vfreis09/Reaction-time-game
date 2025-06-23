const darkModeButton = document.getElementById("dark");
const box = document.getElementById("box");

let waitingForGreen = false;
let startTime = 0;
let timeoutId = null;
let phase = "idle";

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  darkModeButton.textContent = "Light Mode";
} else {
  darkModeButton.textContent = "Dark Mode";
}

darkModeButton.onclick = function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  darkModeButton.textContent = isDark ? "Light Mode" : "Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
};

function setBoxHandler(callback) {
  box.onclick = null;
  box.onmousedown = null;
  box.onpointerdown = callback;
}

function startTest() {
  box.innerHTML = `<div class="main-text">Wait for green...</div>`;
  box.style.backgroundColor = "#5e00b5";
  waitingForGreen = true;
  phase = "waiting";

  setBoxHandler(handleClickDuringRed);

  timeoutId = setTimeout(() => {
    box.style.backgroundColor = "#2ecc71";
    box.innerHTML = `<div class="main-text">CLICK!</div>`;
    phase = "ready";

    requestAnimationFrame(() => {
      setTimeout(() => {
        startTime = performance.now();
        setBoxHandler(recordReaction);
      }, 0);
    });
  }, Math.random() * 2000 + 1000);
}

function handleClickDuringRed() {
  if (waitingForGreen && phase === "waiting") {
    falseStart();
  }
}

function recordReaction() {
  if (!waitingForGreen || phase !== "ready") return;

  const reactionTime = Math.round(performance.now() - startTime);
  updateScores(reactionTime);
  renderScores();

  box.innerHTML = `
    <div class="main-text">Your reaction time is ${reactionTime} ms.</div>
    <div class="sub-text">Click to try again.</div>
  `;
  box.style.backgroundColor = "#5e00b5";
  waitingForGreen = false;
  phase = "idle";

  setBoxHandler(startTest);
}

function falseStart() {
  clearTimeout(timeoutId);
  timeoutId = null;
  waitingForGreen = false;
  phase = "idle";

  box.innerHTML = `
    <div class="main-text">Too soon! Wait for green.</div>
    <div class="sub-text">Click to try again.</div>
  `;
  box.style.backgroundColor = "#f39c12";

  setBoxHandler(startTest);
}

function updateScores(newScore) {
  let lastScores = JSON.parse(localStorage.getItem("lastScores")) || [];
  lastScores.unshift(newScore);
  if (lastScores.length > 5) lastScores.pop();
  localStorage.setItem("lastScores", JSON.stringify(lastScores));

  let bestScores = JSON.parse(localStorage.getItem("bestScores")) || [];
  bestScores.push(newScore);
  bestScores.sort((a, b) => a - b);
  if (bestScores.length > 5) bestScores = bestScores.slice(0, 5);
  localStorage.setItem("bestScores", JSON.stringify(bestScores));
}

function renderScores() {
  const recent = JSON.parse(localStorage.getItem("lastScores")) || [];
  const best = JSON.parse(localStorage.getItem("bestScores")) || [];

  document.getElementById("recentScores").innerHTML = `
    <strong>Last 5 Scores:</strong><br />
    ${recent.length ? recent.join(" ms, ") + " ms" : "No scores yet."}
  `;

  document.getElementById("bestScores").innerHTML = `
    <strong>Best 5 Scores:</strong><br />
    ${best.length ? best.join(" ms, ") + " ms" : "No scores yet."}
  `;
}

box.innerHTML = `<div class="main-text">Click to Start</div>`;
setBoxHandler(startTest);
renderScores();
