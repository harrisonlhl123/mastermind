import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGeneratedCode, sendUserGuess } from '../../store/game';

function MainPage() {
    const dispatch = useDispatch();
    const generatedCode = useSelector(state => state.game.code);
    const guessResult = useSelector(state => state.game.guessResult);
    const [userGuess, setUserGuess] = useState('');
    const [guessHistory, setGuessHistory] = useState([]);
    const [attemptsLeft, setAttemptsLeft] = useState(10);
    const [gameState, setGameState] = useState('ongoing'); // 'ongoing', 'won', 'lost'

    useEffect(() => {
        dispatch(fetchGeneratedCode());
    }, [dispatch]);

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
    }, [guessResult]); // Update guess history when guessResult changes

    const handleSubmitGuess = () => {
        if (userGuess.length !== 4 || !/^[0-7]+$/.test(userGuess)) {
            alert('Please enter a 4-digit number containing digits from 0 to 7.');
            return;
        }

        dispatch(sendUserGuess(userGuess.split('').map(Number), generatedCode));
    };

    const handleRestartGame = () => {
        setGuessHistory([]);
        setAttemptsLeft(10);
        setGameState('ongoing');
        dispatch(fetchGeneratedCode());
    };

    return (
        <div>
            {gameState === 'ongoing' && (
                <div>
                    <h1>Mastermind Game</h1>
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
                    <p>The secret code was: {generatedCode.join(' ')}</p>
                    <button onClick={handleRestartGame}>Restart Game</button>
                </div>
            )}

            {gameState === 'lost' && (
                <div>
                    <h1>Game Over! You lost.</h1>
                    <p>The secret code was: {generatedCode.join(' ')}</p>
                    <button onClick={handleRestartGame}>Restart Game</button>
                </div>
            )}
        </div>
    );
}

export default MainPage;
