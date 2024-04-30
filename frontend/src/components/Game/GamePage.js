import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { fetchGame, sendUserGuess, updateExistingGame, requestHint } from '../../store/game';

function GamePage() {
    // Get the gameId from the route params
    const { gameId } = useParams(); 
    const dispatch = useDispatch();
    const history = useHistory();
    // Get the selectedGame from the store
    const game = useSelector(state => state.game.selectedGame?.game);

    // Set some default states before game is fetched and stored
    const [userGuess, setUserGuess] = useState('');
    const [guessHistory, setGuessHistory] = useState([]);
    const [attemptsLeft, setAttemptsLeft] = useState(0);
    const [gameState, setGameState] = useState('ongoing');
    const [length, setLength] = useState(4)
    const [generatedCode, setGeneratedCode] = useState([1,2,3,4])

    // The exactMatch, correctNumbers, and win?
    const guessResult = useSelector(state => state.game.guessResult);
    // // Get hint when user clicks on hint
    const hint = useSelector(state => state.game.hint)

    // On load or when gameId changes, get the game
    useEffect(() => {
        dispatch(fetchGame(gameId));
    }, [gameId]);

    // Update local state when game changes
    useEffect(() => {
        if (game) {
            setGuessHistory(game.guessHistory);
            setAttemptsLeft(game.attemptsLeft);
            setGameState(game.gameState);
            setLength(game.secretCode.length);
            setGeneratedCode(game.secretCode);
        }
    }, [game]);

    // Everytime a user guesses, we add that to the guess history, reset the user input, decrease the attempt, and check if the game is over
    useEffect(() => {
        if (guessResult) {
            const newGuess = {
                guess: userGuess,
                exactMatches: guessResult.exactMatches,
                correctNumbers: guessResult.correctNumbers
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
        if (userGuess.length != game.secretCode.length || !/^[0-7]+$/.test(userGuess)) {
            alert(`Please enter a ${game.secretCode.length}-digit number containing digits from 0 to 7.`);
            return;
        }

        dispatch(sendUserGuess(userGuess.split('').map(Number), game.secretCode));
    };

    // Handle getting hint
    const requestHintHandler = () => {
        dispatch(requestHint(generatedCode));
    };

    // Update the game and then send the user back to their profile to clear the selectedGame state
    const handleSaveProgress = () => {
        const gameData = {
            guessHistory,
            attemptsLeft,
            gameState,
        };
        dispatch(updateExistingGame(gameId, gameData));

        history.push('/profile');
    };

    // When a player wins or lose, save it in their history
    useEffect(() => {
        if (gameState === 'won' || gameState === 'lost') {
            handleEndProgress();
        }
    }, [gameState]);

    // Update the game when a user wins or lose
    const handleEndProgress = () => {
        const gameData = {
            guessHistory: guessHistory,
            attemptsLeft: attemptsLeft,
            gameState: gameState,
        };
        dispatch(updateExistingGame(gameId, gameData));
    }

    return (
        <div>
            {gameState === 'ongoing' && (
                <div>
                    <h3>Rules: Enter a {length} digit number where the digits are from 0 to 7.</h3>

                    <p>Attempts Left: {attemptsLeft}</p>
                    {/* <p>Generated Code: {generatedCode.join(' ')}</p> */}
                    <input
                        type="text"
                        value={userGuess}
                        onChange={(e) => setUserGuess(e.target.value)}
                    />
                    <button onClick={handleSubmitGuess}>Submit Guess</button>

                    <button onClick={handleSaveProgress}>Save Progress</button>

                    <button onClick={requestHintHandler}>Hint</button>
                    <p>Hint: {hint}</p>

                    <div>
                        <h2>Guess History</h2>
                        <ul>
                            {[...guessHistory].reverse().map((guess, index) => (
                                <li key={index}>
                                    <p>Guess: {guess.guess}</p>
                                    <p>Exact Matches: {guess.exactMatches}</p>
                                    <p>Correct Numbers: {guess.correctNumbers}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {gameState === 'won' && (
                <div>
                    <h1>Congratulations! You won!</h1>
                    <p>The secret code was: {game.secretCode.join('')}</p>
                </div>
            )}

            {gameState === 'lost' && (
                <div>
                    <h1>Game Over! You lost.</h1>
                    <p>The secret code was: {game.secretCode.join('')}</p>
                </div>
            )}
        </div>
    )
}

export default GamePage;