// Get references to HTML elements
const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

// Retrieve high scores from local storage or initialize an empty array
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_HIGH_SCORES = 5;

// Display the most recent score
finalScore.innerText = mostRecentScore;

// Enable the save button only when there is text in the username input field
username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});

// Function to save the high score
async function saveHighScore(e) {
    e.preventDefault();

    // Creates an object with the current score and username
    const score = {
        score: mostRecentScore,
        name: username.value,
    };

    // this will add the score to the highScores array, sort, and keep only the top scores
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(MAX_HIGH_SCORES);

    // Store the updated highScores array in local storage
    localStorage.setItem('highScores', JSON.stringify(highScores));

    //   SweetAlert to display a success message
    Swal.fire({
        title: 'Success!',
        text: 'Your score has been saved.',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK',
    }).then((result) => {
        if (result.isConfirmed) {
             
        }
    });

    // Clear the username input field and disable the save button
    username.value = '';
    saveScoreBtn.disabled = true;
}

//   a click event listener to the save button to trigger the saveHighScore function
saveScoreBtn.addEventListener('click', saveHighScore);
