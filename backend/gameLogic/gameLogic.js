const isValidGuess = (guess) => {
    return guess.every(num => num >= 0 && num <= 7)
}

const numExactMatches = (code, guess) => {
    return code.filter((num, index) => num === guess[index]).length;
};
  
const numNearMatches = (code, guess) => {
    const codeCopy = [...code];
    const guessCopy = [...guess];
    let count = 0;

    // First, check for exact matches and mark them
    for (let i = 0; i < guessCopy.length; i++) {
        if (guessCopy[i] === codeCopy[i]) {
            guessCopy[i] = null;
            codeCopy[i] = null;
        }
    }

    // Then, count the remaining near matches
    for (let i = 0; i < guessCopy.length; i++) {
        if (guessCopy[i] !== null) {
            const codeIndex = codeCopy.indexOf(guessCopy[i]);
            if (codeIndex !== -1) {
                count++;
                codeCopy[codeIndex] = null;
            }
        }
    }

    return count;
};


const isWin = (code, guess) => {
    return numExactMatches(code, guess) === code.length;
};
  
module.exports = {
    isValidGuess,
    numExactMatches,
    numNearMatches,
    isWin,
};