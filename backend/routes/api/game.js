const express = require('express');
const axios = require('axios');
const router = express.Router();
const { isValidGuess } = require('../../gameLogic/gameLogic')


// Route to generate a random 4-number combination
router.get('/generateCode', async (req, res) => {
    try {
      // Make a GET request to the Random Number Generator API based on recommended parameters
      const response = await axios.get('https://www.random.org/integers/', {
        params: {
          num: 4,
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
  
      res.status(200).json({ code });
    } catch (error) {
      console.error('Error generating code:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});


// Route to get the user's guess
router.post('/guess', (req, res) => {
  try {
    const userGuess = req.body.guess;

    // Validate the user's guess
    if (!isValidGuess(userGuess)) {
      // If the guess is invalid, respond with an error message
      return res.status(400).json({ error: 'Invalid guess. Numbers must be between 0 and 7.' });
    }

    res.status(200).json({ message: `Guess received successfully: ${userGuess}` });
  } catch (error) {
    console.error('Error processing guess:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;