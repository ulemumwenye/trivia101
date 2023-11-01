const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});

async function saveHighScore(e) {
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value,
    };

    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(MAX_HIGH_SCORES);

    localStorage.setItem('highScores', JSON.stringify(highScores));

    // Add SweetAlert to display a success message
    Swal.fire({
        title: 'Success!',
        text: 'Your score has been saved.',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK',
    }).then((result) => {
        if (result.isConfirmed) {
            // Optionally, you can redirect or perform other actions after the user clicks OK.
            // For example, redirect to a different page:
            // window.location.href = 'your_redirect_url.html';
        }
    });

    username.value = '';
    saveScoreBtn.disabled = true;
}

saveScoreBtn.addEventListener('click', saveHighScore);
