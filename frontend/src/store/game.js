import jwtFetch from './jwt';

// Action types
const RECEIVE_CODE = "game/RECEIVE_CODE";
const RECEIVE_GUESS_RESULT = "game/RECEIVE_GUESS_RESULT";
const CLEAR_GUESS_RESULT = "game/CLEAR_GUESS_RESULT";


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


// Thunks
export const fetchGeneratedCode = (difficulty) => async dispatch => {
    const res = await jwtFetch(`/api/game/generateCode?difficulty=${difficulty}`);
    if (res.ok) {
        // Takes out the array code
        const { code } = await res.json();
        dispatch(receiveCode(code));
    }

};

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
        dispatch(clearGuessResult()); // Dispatch action to clear guess result
    }
};

// Reducer
const initialState = {
    code: [],
    guessResult: null
};

const gameReducer = (state = initialState, action) => {
    switch(action.type) {
        case RECEIVE_CODE:
            return { ...state, code: action.code };
        case RECEIVE_GUESS_RESULT:
            return { ...state, guessResult: action.result };
        case CLEAR_GUESS_RESULT:
            return { ...state, guessResult: null }; // New case to clear guessResult
        default:
            return state;
    }
};

export default gameReducer;
