const express = require('express');
const fs = require('fs');
const app = express();
const port = 3005;

// Define a route to serve static files (e.g., HTML, CSS, JavaScript)
app.use(express.static('public'));

app.get('/api/questions/:category', (req, res) => {
  const category = req.params.category;
  const fileName = `questions_${category}.txt`;

  // Read questions from the file and send them as JSON
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading questions.');
    } else {
      const questions = JSON.parse(data);
      res.json(questions);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
