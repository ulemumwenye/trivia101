// Get references to various HTML elements by their IDs
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

// Initialize variables to manage the quiz game
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

// Create an empty array to store quiz questions
let questions = [];

// Fetch quiz questions from an external API
fetch('https://opentdb.com/api.php?amount=20&category=22&difficulty=easy&type=multiple')
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        // Format and store the loaded questions in the 'questions' array
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });

        // Start the game once questions are loaded
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

// Define constants for the game
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 20;

// Function to start the game
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

// Function to get a new question and update the UI
getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        // Store the score and redirect to the end page when all questions are answered
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('./end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

// Add event listeners to the answer choices
choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const isCorrect = selectedAnswer == currentQuestion.answer;

        if (isCorrect) {
            selectedChoice.parentElement.classList.add('correct');
        } else {
            choices[currentQuestion.answer - 1].parentElement.classList.add('correct');
            selectedChoice.parentElement.classList.add('incorrect');
        }

        if (isCorrect) {
            incrementScore(CORRECT_BONUS);
        }

        // Reset classes and get the next question after a delay (2 seconds)
        setTimeout(() => {
            choices.forEach((choice) => {
                choice.parentElement.classList.remove('correct', 'incorrect');
            });
            getNewQuestion();
        }, 2000);
    });
});

// Function to increment the score and update the UI
incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};
