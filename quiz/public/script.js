let questions = [];
let time = 0;
let timerId;
let initialTime = 60; // Initial time value (e.g., 60 seconds)

// Function to start the quiz with IT questions
function startITQuiz() {
    fetchQuestions('IT');
}

// Function to start the quiz with Agriculture questions
function startAgricultureQuiz() {
  fetchQuestions('Agriculture');
}

// Function to fetch questions from the server
function fetchQuestions(category) {
    fetch(`/api/questions/${category}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            questions = data;
            time = initialTime;
            quizStart();
        })
        .catch((error) => {
            console.error('Error fetching questions:', error);
        });
}


// Get DOM Elements
let questionsEl = document.querySelector("#questions");
let timerEl = document.querySelector("#timer");
let choicesEl = document.querySelector("#options");
let submitBtn = document.querySelector("#submit-score");
let nameEl = document.querySelector("#name");
let feedbackEl = document.querySelector("#feedback");
let reStartBtn = document.querySelector("#restart");

// Quiz's initial state
let currentQuestionIndex = 0;
timerId = null;

// Start quiz and hide frontpage
function quizStart() {
  if (timerId) {
    clearInterval(timerId); // Clear any existing timer
  }
  timerId = setInterval(clockTick, 1000); // Set the timer to update every second
  timerEl.textContent = time;
  const landingScreenEl = document.getElementById("start-screen");
  landingScreenEl.setAttribute("class", "hide");
  questionsEl.removeAttribute("class");
  getQuestion();
}

// Loop through array of questions and
// answers and create list with buttons
function getQuestion() {
  let currentQuestion = questions[currentQuestionIndex];
  let promptEl = document.getElementById("question-words");
  promptEl.textContent = currentQuestion.prompt;
  choicesEl.innerHTML = "";
  currentQuestion.options.forEach(function (choice, i) {
    let choiceBtn = document.createElement("button");
    choiceBtn.setAttribute("value", choice);
    choiceBtn.textContent = i + 1 + ". " + choice;
    choiceBtn.onclick = questionClick;
    choicesEl.appendChild(choiceBtn);
  });
}

// Check for right answers and deduct
// time for wrong answers, then go to the next question
function questionClick() {
  if (this.value !== questions[currentQuestionIndex].answer) {
    time -= 10;
    if (time < 0) {
      time = 0;
    }
    timerEl.textContent = time;
    feedbackEl.textContent = `Wrong! The correct answer was ${questions[currentQuestionIndex].answer}.`;
    feedbackEl.style.color = "red";
  } else {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "green";
  }
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function () {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 2000);
  currentQuestionIndex++;
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

// End the quiz by hiding questions, stopping the timer, and showing the final score
function quizEnd() {
  clearInterval(timerId);
  let endScreenEl = document.getElementById("quiz-end");
  endScreenEl.removeAttribute("class");
  let finalScoreEl = document.getElementById("score-final");
  finalScoreEl.textContent = time;
  questionsEl.setAttribute("class", "hide");
}

// End the quiz if the timer reaches 0
function clockTick() {
  time--;
  timerEl.textContent = time;
  if (time <= 0) {
    quizEnd();
  }
}

// Save the score in local storage along with the user's name
function saveHighscore() {
  let name = nameEl.value.trim();
  if (name !== "") {
    let highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];
    let newScore = {
      score: time,
      name: name,
    };
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));
    alert("Your Score has been Submitted");
  }
}

// Save the user's score after pressing enter
function checkForEnter(event) {
  if (event.key === "Enter") {
    saveHighscore();
    alert("Your Score has been Submitted");
  }
}

nameEl.onkeyup = checkForEnter;

// Save the user's score after clicking submit
submitBtn.onclick = saveHighscore;

// Start the quiz after clicking the "Start IT Quiz" or "Start Agriculture Quiz" buttons
document.querySelector("#start").addEventListener("click", startITQuiz);
document.querySelector("#agriculture").addEventListener("click", startAgricultureQuiz);

document.addEventListener("DOMContentLoaded", function() {
    // Simulate loading time (you can replace this with your actual initialization code)
    setTimeout(function() {
        hideSplashScreen();
    }, 3000); // Hide the splash screen after 3 seconds (adjust as needed)

    function hideSplashScreen() {
        const splashScreen = document.getElementById("splash-screen");
        const mainContent = document.getElementById("main-content");

        // Hide the splash screen
        splashScreen.style.display = "none";

        // Show the main content
        mainContent.style.display = "block";
    }
});
