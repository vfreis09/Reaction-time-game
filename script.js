const box = document.getElementById("box");
const result = document.getElementById("result");
const resetBtn = document.getElementById("resetBtn");

let waitingForGreen = false;
let startTime = 0;
let timeoutId = null;

function startTest() {
  box.textContent = "Wait for green...";
  box.style.backgroundColor = "red";
  result.textContent = "";
  waitingForGreen = true;
  resetBtn.style.display = "none";

  timeoutId = setTimeout(() => {
    box.style.backgroundColor = "green";
    box.textContent = "CLICK!";
    startTime = Date.now();
    box.onclick = recordReaction;
  }, Math.random() * 2000 + 1000); // 1 to 3 seconds random delay
}

function recordReaction() {
  if (!waitingForGreen) return; // ignore if not waiting for green

  const reactionTime = Date.now() - startTime;
  box.textContent = "Click to Start";
  box.style.backgroundColor = "gray";
  result.textContent = `Your reaction time is ${reactionTime} ms!`;
  waitingForGreen = false;
  box.onclick = startTest;
  resetBtn.style.display = "inline-block";
}

function falseStart() {
  clearTimeout(timeoutId);
  box.textContent = "Too soon! Wait for green.";
  box.style.backgroundColor = "orange";
  result.textContent = "";
  waitingForGreen = false;
  box.onclick = startTest;
  resetBtn.style.display = "inline-block";
}

box.onclick = (e) => {
  if (waitingForGreen && box.style.backgroundColor === "red") {
    falseStart();
  } else if (!waitingForGreen) {
    startTest();
  }
};

resetBtn.onclick = () => {
  result.textContent = "";
  box.textContent = "Click to Start";
  box.style.backgroundColor = "gray";
  resetBtn.style.display = "none";
  box.onclick = startTest;
};
