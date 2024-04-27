const express = require('express');
const axios = require('axios');
const router = express.Router();
const { isValidGuess, numExactMatches, numNearMatches, isWin } = require('../../gameLogic/gameLogic');
const Game = require('../../models/Game');
const { requireUser } = require('../../config/passport');


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

      // Get the generated code array from the request body
      const generatedCode = req.body.generatedCode; 

      // Randomly select a position for the hint
      const hintPosition = Math.floor(Math.random() * generatedCode.length);

      // Construct the hint message
      const hintMessage = `Position ${hintPosition + 1} is ${generatedCode[hintPosition]}.`;

      return res.status(200).json({ hint: hintMessage });
  } catch (error) {
      return res.status(500).json({ message: 'Error generating hint' });
  }
});



// Route to save a new game session
router.post('/saveGame', requireUser, async (req, res) => {
  try {

      // Parameters needed to save a game
      const { user, secretCode, guessHistory, attemptsLeft, gameState } = req.body;

      // Try to save the game
      const game = new Game({
          user,
          secretCode,
          guessHistory,
          attemptsLeft,
          gameState,
      });

      await game.save();

      res.status(201).json({ message: 'Game saved successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Failed to save game' });
  }
});


// Route to get game history for a user
router.get('/gameHistory/:userId', requireUser, async (req, res) => {
  try {

      // Parameter's userId
      const userId = req.params.userId;

      // requireUser middleware
      const authenticatedUserId = req.user.id;

      // Check if the requested user ID matches the authenticated user ID
      if (userId !== authenticatedUserId) {
          return res.status(403).json({ message: 'Unauthorized access to user game history' });
      }

      // Find all the games with that userId as reference
      const gameHistory = await Game.find({ user: userId }).sort({ createdAt: -1 });
      
      res.status(200).json({ gameHistory });
  } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve game history' });
  }
});


// Route to get a specific game belonging to the logged-in user
router.get('/:gameId', requireUser, async (req, res) => {
  try {

      // The gameId from the parameter
      const gameId = req.params.gameId;

      // requireUser middleware
      const authenticatedUserId = req.user.id;

      // Find the game by ID
      const game = await Game.findById(gameId);

      // Check if the game exists
      if (!game) {
          return res.status(404).json({ error: 'Game not found' });
      }

      // Check if the game belongs to the authenticated user
      if (game.user.toString() !== authenticatedUserId) {
          return res.status(403).json({ error: 'Unauthorized access to game' });
      }

      // Return the game data
      res.status(200).json({ game });
  } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve game' });
  }
});


// Route to update an existing game session
router.patch('/updateGame/:gameId', requireUser, async (req, res) => {
  try {

      // The gameId from the parameter
      const gameId = req.params.gameId;

      // The parts we want to change
      const { guessHistory, attemptsLeft, gameState } = req.body;

      // Find the game session by ID
      const game = await Game.findById(gameId);

      // Check if the game session exists
      if (!game) {
          return res.status(404).json({ error: 'Game not found' });
      }

      // Update the guessHistory, attemptsLeft, and gameState
      game.guessHistory = guessHistory;
      game.attemptsLeft = attemptsLeft;
      game.gameState = gameState;

      // Save the updated game session
      await game.save();

      res.status(200).json({ message: 'Game updated successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Failed to update game' });
  }
});


module.exports = router;