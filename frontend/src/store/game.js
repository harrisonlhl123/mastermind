import jwtFetch from './jwt';

// Action types
const RECEIVE_CODE = "game/RECEIVE_CODE";
const RECEIVE_GUESS_RESULT = "game/RECEIVE_GUESS_RESULT";
const CLEAR_GUESS_RESULT = "game/CLEAR_GUESS_RESULT";
const RECEIVE_HINT = "game/RECEIVE_HINT";
const CLEAR_HINT = "game/CLEAR_HINT";
const RECEIVE_GAME_HISTORY = "game/RECEIVE_GAME_HISTORY";
const CLEAR_GAME_HISTORY = 'game/CLEAR_GAME_HISTORY';
const RECEIVE_GAME = "game/RECEIVE_GAME";
const CLEAR_SELECTED_GAME = "game/CLEAR_SELECTED_GAME";


// Action creators
const receiveCode = code => ({
    type: RECEIVE_CODE,
    code
});

const receiveGuessResult = result => ({
    type: RECEIVE_GUESS_RESULT,
    result
});

const clearGuessResult = () => ({
    type: CLEAR_GUESS_RESULT
});

const receiveHint = hint => ({
    type: RECEIVE_HINT,
    hint
});

const clearHint = () => ({
    type: CLEAR_HINT
});

const receiveGameHistory = gameHistory => ({
    type: RECEIVE_GAME_HISTORY,
    gameHistory
});

const clearGameHistory = () => ({
    type: CLEAR_GAME_HISTORY
})

const receiveGame = game => ({
    type: RECEIVE_GAME,
    game
});

const clearSelectedGame = () => ({
    type: CLEAR_SELECTED_GAME
});



// Thunks

// Makes the secretCode
export const fetchGeneratedCode = (difficulty) => async dispatch => {
    const res = await jwtFetch(`/api/game/generateCode?difficulty=${difficulty}`);
    if (res.ok) {
        // Takes out the array code
        const { code } = await res.json();
        dispatch(receiveCode(code));
    }
};


// Sends the user guess and returns info like exact matches, correct numbers, win?
export const sendUserGuess = (guess, generatedCode) => async dispatch => {
    const res = await jwtFetch('/api/game/guess', {
        method: 'POST',
        // Stringify 1 parameter, an object
        body: JSON.stringify({ guess, generatedCode }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (res.ok) {
        const result = await res.json();
        dispatch(receiveGuessResult(result));

        // Clear the guess result and hint
        dispatch(clearGuessResult());
        dispatch(clearHint());
    }
};


// Save a new game
export const saveNewGame = (gameData) => async (dispatch) => {
    try {
      const response = await jwtFetch('/api/game/saveGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
      });
  
      if (response.ok) {
        // Game saved successfully
        console.log("Game saved successfully")
      }
    } catch (error) {
      console.error('Error saving game:', error);
    }
};

// Update an existing game
export const updateExistingGame = (gameId, gameData) => async (dispatch) => {
    try {
      const response = await jwtFetch(`/api/game/updateGame/${gameId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
      });
  
      if (response.ok) {
        // Game updated successfully
        console.log("Game updated successfully")
      }
    } catch (error) {
      console.error('Error updating game:', error);
    }
};
  

// Get a user's game history
export const fetchGameHistory = (userId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/game/gameHistory/${userId}`);
        if (res.ok) {
            const data = await res.json();
            const gameHistory = data.gameHistory;
            dispatch(receiveGameHistory(gameHistory));
        }
    } catch (error) {
        console.error('Error fetching game history:', error);
    }
};


export const clearGameHistoryThunk = () => async (dispatch) => {
    dispatch(clearGameHistory());
}


// Get a specific game
export const fetchGame = (gameId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/game/${gameId}`);
        if (res.ok) {
            const game = await res.json();
            dispatch(receiveGame(game));
        }
    } catch (error) {
        console.error('Error fetching game:', error);
    }
};


// Clear selectedGame every time user visits the profile page so the correct game gets updated in the state
export const clearSelectedGameThunk = () => dispatch => {
    dispatch(clearSelectedGame());
};


// Creates the hint
export const requestHint = (generatedCode) => async dispatch => {
    try {
        const res = await jwtFetch('/api/game/hints', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ generatedCode })
        });

        if (res.ok) {
            const { hint } = await res.json();
            dispatch(receiveHint(hint));
        }
    } catch (error) {
        console.error('Error requesting hint:', error);
    }
};

// Reducer
const initialState = {
    code: [],
    guessResult: null,
    hint: '',
    gameHistory: [],
    selectedGame: null,
};

const gameReducer = (state = initialState, action) => {
    switch(action.type) {
        // Sets code to be the secretCode
        case RECEIVE_CODE:
            return { ...state, code: action.code };
        // Sets guessResult to be the guessResult
        case RECEIVE_GUESS_RESULT:
            return { ...state, guessResult: action.result };
        // Sets guessResult to null after every guess
        case CLEAR_GUESS_RESULT:
            return { ...state, guessResult: null };
        // Sets hint to hint
        case RECEIVE_HINT:
            return { ...state, hint: action.hint };
        // Clears the hint after every guess
        case CLEAR_HINT:
            return { ...state, hint: '' };
        // Gets the gameHistory
        case RECEIVE_GAME_HISTORY:
            return { ...state, gameHistory: action.gameHistory };
        case CLEAR_GAME_HISTORY:
            return {...state, gameHistory: [] };
        // Fetches the selectedGame
        case RECEIVE_GAME:
            return { ...state, selectedGame: action.game };
        // Clears the selectedGame when users go to their profile
        case CLEAR_SELECTED_GAME:
            return { ...state, selectedGame: null };
        default:
            return state;
    }
};

export default gameReducer;
