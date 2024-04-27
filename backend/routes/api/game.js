const express = require('express');
const axios = require('axios');
const router = express.Router();
const { isValidGuess, numExactMatches, numNearMatches, isWin } = require('../../gameLogic/gameLogic');


// Route to generate a random 4-number combination
router.get('/generateCode', async (req, res) => {
    try {
      // Additional feature that allow users to choose a difficulty level
      const difficulty = req.query.difficulty || 4;

      // Make a GET request to the Random Number Generator API based on recommended parameters
      const response = await axios.get('https://www.random.org/integers/', {
        params: {
          num: difficulty,
          min: 0,
          max: 7,
          col: 1,
          base: 10,
          format: 'plain',
          rnd: 'new'
        }
      });
      
      // Extract the numbers from the response and convert to an array
      const code = response.data.trim().split('\n').map(Number);
  
      return res.status(200).json({ code });
    } catch (error) {
      res.status(500).json({ message: 'Error generating code' });
    }
});


// Route to get the user's guess
router.post('/guess', (req, res) => {
  try {
    const userGuess = req.body.guess;
    const generatedCode = req.body.generatedCode;

    // Validate the user's guess
    if (isValidGuess(userGuess, generatedCode) == false) {
      return res.status(400).json({ error: 'Invalid guess. Numbers must be between 0-7 and guess must be same length as secret code.' });
    }

    // Determine number of exact matches
    const exactMatches = numExactMatches(generatedCode, userGuess);

    // Determine number of near matches
    const nearMatches = numNearMatches(generatedCode, userGuess);

    // Check if the user has won
    const win = isWin(generatedCode, userGuess);

    const response = {
      exactMatches,
      nearMatches,
      win,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: 'Not a valid guess. Check userGuess and generatedCode' });
  }
});


// Route for hints
router.post('/hints', (req, res) => {
  try {
      const generatedCode = req.body.generatedCode; // Get the generated code array from the request body

      // Randomly select a position for the hint
      const hintPosition = Math.floor(Math.random() * generatedCode.length);

      // Construct the hint message
      const hintMessage = `Position ${hintPosition + 1} is ${generatedCode[hintPosition]}.`;

      return res.status(200).json({ hint: hintMessage });
  } catch (error) {
      return res.status(500).json({ message: 'Error generating hint' });
  }
});





module.exports = router;