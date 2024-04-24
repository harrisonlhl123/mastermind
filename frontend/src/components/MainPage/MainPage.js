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
        }
    }, [guessResult]); // Update guess history when guessResult changes

    const handleSubmitGuess = () => {
        if (userGuess.length !== 4 || !/^\d+$/.test(userGuess)) {
            alert('Please enter a 4-digit number.');
            return;
        }

        dispatch(sendUserGuess(userGuess.split('').map(Number), generatedCode));
    };

    return (
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
                    {guessHistory.map((guess, index) => (
                        <li key={index}>
                            <p>Guess: {guess.guess}</p>
                            <p>Exact Matches: {guess.exactMatches}</p>
                            <p>Near Matches: {guess.nearMatches}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MainPage;


