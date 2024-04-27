import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { fetchGame, sendUserGuess, updateExistingGame, requestHint } from '../../store/game';

function GamePage() {
    const { gameId } = useParams(); // Get the gameId from the route params
    const dispatch = useDispatch();
    const history = useHistory();

    const game = useSelector(state => state.game.selectedGame?.game);


    const [userGuess, setUserGuess] = useState('');
    // const [guessHistory, setGuessHistory] = useState(game?.guessHistory);
    // const [attemptsLeft, setAttemptsLeft] = useState(game?.attemptsLeft);
    // const [gameState, setGameState] = useState(game?.gameState);
    const [guessHistory, setGuessHistory] = useState([]);
    const [attemptsLeft, setAttemptsLeft] = useState(0);
    const [gameState, setGameState] = useState('ongoing');
    const [length, setLength] = useState(4)
    const [generatedCode, setGeneratedCode] = useState([1,2,3,4])

    const guessResult = useSelector(state => state.game.guessResult);

    const hint = useSelector(state => state.game.hint)

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

    const handleSubmitGuess = () => {
        if (userGuess.length !== game.secretCode.length || !/^[0-7]+$/.test(userGuess)) {
            alert(`Please enter a ${game.secretCode.length}-digit number containing digits from 0 to 7.`);
            return;
        }

        dispatch(sendUserGuess(userGuess.split('').map(Number), game.secretCode));
    };

    const requestHintHandler = () => {
        dispatch(requestHint(generatedCode));
    };

    const handleSaveProgress = () => {
        const gameData = {
            guessHistory: guessHistory,
            attemptsLeft: attemptsLeft,
            gameState: gameState,
        };
        dispatch(updateExistingGame(gameId, gameData));

        history.push('/profile');
    };


    useEffect(() => {
        if (gameState === 'won' || gameState === 'lost') {
            handleEndProgress();
        }
    }, [gameState]);

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
            {console.log(game)}
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

                    <button onClick={requestHintHandler}>Hint</button>
                    <p>Hint: {hint}</p>

                    <button onClick={handleSaveProgress}>Save Progress</button>

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