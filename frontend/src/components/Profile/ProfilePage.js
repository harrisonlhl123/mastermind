import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGameHistory } from '../../store/game';
import { Link } from 'react-router-dom';
import { clearSelectedGameThunk } from '../../store/game';

function ProfilePage() {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.user);
    const gameHistory = useSelector(state => state.game.gameHistory);
    const fetchGameHistoryFail = useSelector(state => state.game.fetchGameHistoryFail);

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchGameHistory(currentUser._id));
        }

        dispatch(clearSelectedGameThunk());
    }, [dispatch, currentUser]);

    return (
        <div>
            {fetchGameHistoryFail && <p>Failed to fetch game history</p>}
            <h2>Game History</h2>
            <ul>
                {gameHistory.map((game, index) => (
                    <li key={index}>
                        <Link to={`/game/${game._id}`}>{`Game ${game._id}`}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProfilePage;