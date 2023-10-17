let questions = [];

let itQuestions = [
    // Information Technology questions
    {
        prompt: "Inside which HTML element do we put the JavaScript?",
        options: ["<javascript>", "<js>", "<script>", "<scripting>"],
        answer: "<script>",
    },
    {
        prompt: "How do you call a function named myFunction?",
        options: ["call myFunction()", "myFunction()", "call function myFunction", "Call.myFunction"],
        answer: "myFunction()",
    },
    // Add more IT questions here...
];

let agricultureQuestions = [
    // Agriculture questions
    {
        prompt: "What is the primary crop grown in this region?",
        options: ["Wheat", "Rice", "Corn", "Soybeans"],
        answer: "Corn",
    },
    {
        prompt: "Which type of soil is best for growing sunflowers?",
        options: ["Sandy soil", "Clay soil", "Loamy soil", "Rocky soil"],
        answer: "Loamy soil",
    },
    // Add more Agriculture questions here...
];

// Set the initial time value (e.g., 60 seconds)
let initialTime = 60;
let time = initialTime;
let timerId;

// Function to start the quiz with IT questions
function startITQuiz() {
    questions = itQuestions;
    time = initialTime; // Reset the timer to the initial time value
    quizStart();
}

// Function to start the quiz with Agriculture questions
function startAgricultureQuiz() {
    questions = agricultureQuestions;
    time = initialTime; // Reset the timer to the initial time value
    quizStart();
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
    let landingScreenEl = document.getElementById("start-screen");
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
