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

// Checks for correct numbers
const numCorrectNumbers = (code, guess) => {
    let secretCodeHash = {}
    let count = 0

    code.forEach((ele) => {
        if (ele in secretCodeHash) {
            secretCodeHash[ele]++
        } else {
            secretCodeHash[ele] = 1
        }
    })

    guess.forEach((ele) => {
        if (ele in secretCodeHash && secretCodeHash[ele] > 0) {
            count++
            secretCodeHash[ele]--
        }
    })

    return count
};


// Checks if a user won by checking if exact matches is the same length as the code
const isWin = (code, guess) => {
    return numExactMatches(code, guess) === code.length;
};
  
module.exports = {
    isValidGuess,
    numExactMatches,
    numCorrectNumbers,
    isWin,
};