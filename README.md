# Mastermind

Welcome to Mastermind! This project is a web application built using the MERN stack. It allows the user to adjust the difficulty, get hints, and save and view their past games.

## Getting Started

To run this project locally, follow these steps:

1. Navigate to the backend directory and run this command to start the backend server:
   ```
   npm run dev
   ```

2. Open a new terminal window and navigate to the frontend directory and run this command to start the frontend server:
   ```
   npm start
   ```

3. Open your web browser and navigate to http://localhost:3000 to view the application.

## Features
* User Authentication: Users can sign up, log in, and log out.
* Gameplay: Users guess the secret code and will be given feedback for exact matches and correct numbers.
* Difficulty: Users can adjust the difficulty by choosing how long the code should be.
* Hints: Users can press on "Hint" and an exact match will be given to them.
* Saving: Users who log in can save their games and view them later.

## Code structure
* Backend: Models, routes, and game logic.
* Frontend: Store, main page for a new game, and game show page for an old game.

## Notable feature:
Saving and updating a game was definitely challenging because I had to think about what the game model looks like and the different routes to save, update, and get the game.
```
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
```

## Technologies Used
* React
* Node.js
* Express
* MongoDB
* Redux

