import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGeneratedCode, sendUserGuess } from '../../store/game';

function MainPage() {
    const dispatch = useDispatch();
    // The secret code
    const generatedCode = useSelector(state => state.game.code);
    // The exactMatch, nearMatch, and win?
    const guessResult = useSelector(state => state.game.guessResult);
    // User's input
    const [userGuess, setUserGuess] = useState('');
    // An array to keep track of the user's guess history
    const [guessHistory, setGuessHistory] = useState([]);
    // Counter for attempts
    const [attemptsLeft, setAttemptsLeft] = useState(10);
    // Indicate if the game's status
    const [gameState, setGameState] = useState('ongoing');

    const [difficulty, setDifficulty] = useState(4);

    // Generate secret code right away
    useEffect(() => {
        dispatch(fetchGeneratedCode(difficulty));
    }, [dispatch, difficulty]);

    // Everytime a user guesses, we add that to the guess history, reset the user input, decrease the attempt, and check if the game is over
    useEffect(() => {
        if (guessResult) {
            const newGuess = {
                guess: userGuess,
                exactMatches: guessResult.exactMatches,
                nearMatches: guessResult.nearMatches
            };
            setGuessHistory([...guessHistory, newGuess]);
            setUserGuess('');
            setAttemptsLeft(attemptsLeft - 1);

            // Check if the game should end
            if (guessResult.win) {
                setGameState('won');
            } else if (attemptsLeft === 1) {
                setGameState('lost');
            }
        }
    }, [guessResult]); // Whenever the user submits a new guess and the result comes back, do this.


    // A little error handling on the frontend and dispatch the user's guess.
    const handleSubmitGuess = () => {
        if (userGuess.length !== difficulty || !/^[0-7]+$/.test(userGuess)) {
            alert(`Please enter a ${difficulty}-digit number containing digits from 0 to 7.`);
            return;
        }

        dispatch(sendUserGuess(userGuess.split('').map(Number), generatedCode));
    };

    // After the game ends, restart the game by setting the states to default.
    const handleRestartGame = () => {
        setGuessHistory([]);
        setAttemptsLeft(10);
        setGameState('ongoing');
        dispatch(fetchGeneratedCode(difficulty));
    };

    return (
        <div>
            {gameState === 'ongoing' && (
                <div>
                    <h1>Mastermind Game</h1>

                    <h3>Rules: Enter a {difficulty} digit number where the digits are from 0 to 7.</h3>
                    <label>Choose Difficulty:</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(parseInt(e.target.value))}>
                        <option value={4}>Easy (4 digits)</option>
                        <option value={6}>Medium (6 digits)</option>
                        <option value={8}>Hard (8 digits)</option>
                    </select>

                    <p>Attempts Left: {attemptsLeft}</p>
                    <p>Generated Code: {generatedCode.join(' ')}</p>
                    <input
                        type="text"
                        value={userGuess}
                        onChange={(e) => setUserGuess(e.target.value)}
                    />
                    <button onClick={handleSubmitGuess}>Submit Guess</button>
                    <div>
                        <h2>Guess History</h2>
                        <ul>
                            {[...guessHistory].reverse().map((guess, index) => (
                                <li key={index}>
                                    <p>Guess: {guess.guess}</p>
                                    <p>Exact Matches: {guess.exactMatches}</p>
                                    <p>Near Matches: {guess.nearMatches}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {gameState === 'won' && (
                <div>
                    <h1>Congratulations! You won!</h1>
                    <p>The secret code was: {generatedCode.join('')}</p>
                    <button onClick={handleRestartGame}>Restart Game</button>
                </div>
            )}

            {gameState === 'lost' && (
                <div>
                    <h1>Game Over! You lost.</h1>
                    <p>The secret code was: {generatedCode.join('')}</p>
                    <button onClick={handleRestartGame}>Restart Game</button>
                </div>
            )}
        </div>
    );
}

export default MainPage;
