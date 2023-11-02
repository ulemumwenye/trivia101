// Get a reference to the HTML element with the ID "highScoresList"
const highScoresList = document.getElementById("highScoresList");

// Retrieve high scores from local storage or initialize an empty array
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// Update the inner HTML of the "highScoresList" element with a list of high scores
highScoresList.innerHTML = highScores
  .map(score => {
    // Create list items for each high score and join them into a single string
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
  .join("");
