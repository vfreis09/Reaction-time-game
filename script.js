const box = document.getElementById("box");

let waitingForGreen = false;
let startTime = 0;
let timeoutId = null;
let phase = "idle";

function setBoxHandler(callback) {
  box.onclick = null;
  box.onmousedown = null;
  box.onpointerdown = callback;
}

function startTest() {
  box.innerHTML = `<div class="main-text">Wait for green...</div>`;
  box.style.backgroundColor = "#d72638";
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

  const reactionTime = performance.now() - startTime;
  box.innerHTML = `
    <div class="main-text">Your reaction time is ${Math.round(
      reactionTime
    )} ms.</div>
    <div class="sub-text">Click to try again.</div>
  `;
  box.style.backgroundColor = "#7F00FF";
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

box.innerHTML = `<div class="main-text">Click to Start</div>`;
setBoxHandler(startTest);
