const isValidGuess = (guess) => (
    guess.every(num => num >= 0 && num <= 7)
)

module.exports = { isValidGuess };