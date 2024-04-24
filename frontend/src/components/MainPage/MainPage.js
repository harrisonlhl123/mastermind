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

    const handleSubmitGuess = () => {
        if (userGuess.length !== 4 || !/^\d+$/.test(userGuess)) {
            alert('Please enter a 4-digit number.');
            return;
        }

        dispatch(sendUserGuess(userGuess.split('').map(Number), generatedCode));
        setGuessHistory([...guessHistory, userGuess]);
        setUserGuess('');
        setAttemptsLeft(attemptsLeft - 1);
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
                        <li key={index}>{guess}</li>
                    ))}
                </ul>
            </div>
            {guessResult && (
                <div>
                    <h2>Feedback</h2>
                    <p>Exact Matches: {guessResult.exactMatches}</p>
                    <p>Near Matches: {guessResult.nearMatches}</p>
                    <p>Win: {guessResult.win ? 'Yes' : 'No'}</p>
                </div>
            )}
        </div>
    );
}

export default MainPage;
