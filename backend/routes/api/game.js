const express = require('express');
const axios = require('axios');
const router = express.Router();

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
    const userGuess = req.body.guess; // Assuming the user's guess is sent in the request body

    // You can log or process the user's guess as needed
    console.log('User guess:', userGuess);

    // Respond with a success message
    res.status(200).json({ message: 'Guess received successfully' });
  } catch (error) {
    console.error('Error processing guess:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;