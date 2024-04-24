import jwtFetch from './jwt';

// Action types
const RECEIVE_CODE = "game/RECEIVE_CODE";
const RECEIVE_GUESS_RESULT = "game/RECEIVE_GUESS_RESULT";

// Action creators
const receiveCode = code => ({
    type: RECEIVE_CODE,
    code
});

const receiveGuessResult = result => ({
    type: RECEIVE_GUESS_RESULT,
    result
});

// Thunks
export const fetchGeneratedCode = () => async dispatch => {
    try {
        const res = await jwtFetch('/api/game/generateCode');
        if (res.ok) {
            const { code } = await res.json();
            dispatch(receiveCode(code));
        }
    } catch (error) {
        console.error('Error fetching generated code:', error);
        // Handle error if needed
    }
};

export const sendUserGuess = (guess, generatedCode) => async dispatch => {
    try {
        const res = await jwtFetch('/api/game/guess', {
            method: 'POST',
            body: JSON.stringify({ guess, generatedCode }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) {
            const result = await res.json();
            dispatch(receiveGuessResult(result));
        }
    } catch (error) {
        console.error('Error sending user guess:', error);
        // Handle error if needed
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
        default:
            return state;
    }
};

export default gameReducer;
