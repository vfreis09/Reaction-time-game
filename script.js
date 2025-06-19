const box = document.getElementById("box");
const result = document.getElementById("result");
const resetBtn = document.getElementById("resetBtn");

let waitingForGreen = false;
let startTime = 0;
let timeoutId = null;

function setBoxHandler(callback) {
  box.onclick = null;
  box.onmousedown = null;
  box.onpointerdown = callback;
}

function startTest() {
  box.textContent = "Wait for green...";
  box.style.backgroundColor = "red";
  result.textContent = "";
  waitingForGreen = true;
  resetBtn.style.display = "none";

  // Set click handler for false start check
  setBoxHandler(handleClickDuringRed);

  timeoutId = setTimeout(() => {
    box.style.backgroundColor = "green";
    box.textContent = "CLICK!";

    requestAnimationFrame(() => {
      setTimeout(() => {
        startTime = performance.now();
        setBoxHandler(recordReaction);
      }, 0);
    });
  }, Math.random() * 2000 + 1000);
}

function handleClickDuringRed() {
  if (waitingForGreen && box.style.backgroundColor === "red") {
    falseStart();
  }
}

function recordReaction() {
  if (!waitingForGreen) return;

  const reactionTime = performance.now() - startTime;
  box.textContent = "Click to Start";
  box.style.backgroundColor = "gray";
  result.textContent = `Your reaction time is ${reactionTime} ms!`;

  waitingForGreen = false;
  resetBtn.style.display = "inline-block";

  // Set click handler to restart test
  setBoxHandler(startTest);
}

function falseStart() {
  clearTimeout(timeoutId); // Cancel the green light
  timeoutId = null;

  box.textContent = "Too soon! Wait for green.";
  box.style.backgroundColor = "orange";
  result.textContent = "";
  waitingForGreen = false;
  resetBtn.style.display = "inline-block";

  // Set click handler to restart test
  setBoxHandler(startTest);
}

resetBtn.onclick = () => {
  result.textContent = "";
  box.textContent = "Click to Start";
  box.style.backgroundColor = "gray";
  resetBtn.style.display = "none";

  // Set click handler to start test again
  setBoxHandler(startTest);
};

// Initial setup
setBoxHandler(startTest);
