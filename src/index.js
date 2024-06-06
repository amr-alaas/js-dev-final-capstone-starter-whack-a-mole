const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const startButton = document.querySelector('#start');
const score = document.querySelector('#score');
const timerDisplay = document.querySelector('#timer');
const zombiesGrowlingAudio = document.getElementById("zombiesGrowlingAudio"); // Get audio element by id

let time = 0;
let timer;
let lastHole = null;
let points = 0;
let difficulty = "hard";

/**
 * Generates a random integer within a range.
 */
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * This function takes a `difficulty` parameter that can have three values: `easy`
 * `normal` or `hard`. If difficulty is "easy" then the function returns a time delay
 * of 1500 milliseconds (or 1.5 seconds). If the difficulty is set to "normal" it should
 * return 1000. If difficulty is set to "hard" it should return a randomInteger between
 * 600 and 1200.
 */
function setDelay(difficulty) {
  return difficulty === "easy" ? 1500 :
           difficulty === "normal" ? 1000 :
           difficulty === "hard" ? randomInteger(600, 1200) :
           (() => { throw new Error("Invalid difficulty level!"); })();
}

// This function chooses a random hole from a list of holes.
function chooseHole(holes) {
  let index = Math.floor(Math.random() * holes.length);
  let hole = holes[index];

  if (hole === lastHole) {
    return chooseHole(holes); // Select a different hole
  } else {
    lastHole = hole;
    return hole;
  }
}

/**
 * Calls the showUp function if time > 0 and stops the game if time = 0.
 */
function gameOver() {
  if (time > 0) {
    const timeoutId = showUp();
    return timeoutId;
  } else {
    const gameStopped = stopGame();
    return gameStopped;
  }
}

/**
 * Calls the showAndHide() function with a specific delay and a hole.
 */
function showUp() {
  let delay = setDelay(difficulty);
  const hole = chooseHole(holes);
  return showAndHide(hole, delay);
}

/**
 * The purpose of this function is to show and hide the mole given
 * a delay time and the hole where the mole is hidden.
 */
function showAndHide(hole, delay) {
  toggleVisibility(hole);
  const timeoutID = setTimeout(() => {
    toggleVisibility(hole);
    gameOver();
  }, delay);
  return timeoutID;
}

/**
 * Adds or removes the 'show' class that is defined in styles.css to
 * a given hole.
 */
function toggleVisibility(hole) {
  hole.classList.toggle('show');
  return hole;
}

// This function increments the points global variable and updates the scoreboard.
function updateScore() {
  points += 1;
  score.textContent = points;
  return points;
}

// This function clears the score by setting `points = 0`.
function clearScore() {
  points = 0;
  score.textContent = points;
  return points;
}

/**
 * Updates the control board with the timer if time > 0
 */
function startTimer() {
  timer = setInterval(updateTimer, 1000);
  return timer;
}

// Starts the timer using setInterval.
function updateTimer() {
  if (time > 0) {
    time -= 1;
    timerDisplay.textContent = time;
    if (time <= 3) {
      timerDisplay.classList.add('red'); // Add 'red' class when 3 seconds remaining or less
    } else {
      timerDisplay.classList.remove('red'); // Remove 'red' class if more than 3 seconds remaining
    }
    if (time === 0) {
      stopAudio(zombiesGrowlingAudio); // Stop the audio
      clearInterval(timer); // Stop the timer
    }
  }
  return time;
}

/**
 * This is the event handler that gets called when a player
 * clicks on a mole.
 */
function whack(event) {
  updateScore();
  return points;
}

// Adds the 'click' event listeners to the moles.
function setEventListeners() {
  moles.forEach(mole => {
    mole.addEventListener('click', whack); // Add click event listener to each mole
  });
  return moles; // Return the moles array
}

/**
 * This function sets the duration of the game.
 */
function setDuration(duration) {
  time = duration;
  return time;
}

/**
 * This function is called when the game is stopped.
 */
function stopGame() {
  clearInterval(timer);
  clearScore();
  return "game stopped";
}

/**
 * This is the function that starts the game when the `startButton`
 * is clicked.
 */
function startGame() {
  setDuration(10);
  showUp();
  startTimer();
  setEventListeners();
  zombiesGrowlingAudio.play(); // Start playing the audio
  return "game started";
}

document.addEventListener("DOMContentLoaded", function() {
  startButton.addEventListener("click", startGame);
});