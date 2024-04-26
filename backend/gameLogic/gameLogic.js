// Checks is a guess is valid by ensuring guess is same length as secret code and numbers are between 0-7
const isValidGuess = (guess, secretCode) => {
    validNums = guess.every(num => num >= 0 && num <= 7);
    if (validNums && guess.length == secretCode.length) {
        return true;
    } else {
        return false;
    }
}

// Checks exact matches by filtering numbers that are the same and in the same position and returning the length
const numExactMatches = (code, guess) => {
    const exactMatchesArr = code.filter((num, index) => num === guess[index])
    return exactMatchesArr.length;
};

// Checks for near matches
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
            // Get the index of the number inside secret code, if it exists
            const codeIndex = codeCopy.indexOf(guessCopy[i]);
            if (codeIndex !== -1) {
                count++;
                // Set the number inside of secret code to be null to avoid double counting
                codeCopy[codeIndex] = null;
            }
        }
    }

    return count;
};


// Checks if a user won by checking if exact matches is the same length as the code
const isWin = (code, guess) => {
    return numExactMatches(code, guess) === code.length;
};
  
module.exports = {
    isValidGuess,
    numExactMatches,
    numNearMatches,
    isWin,
};