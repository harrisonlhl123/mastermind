const { check } = require('express-validator');
const handleValidationErrors = require('./handleValidationErrors');

const validateGameInput = [
    check('user')
        .exists({ checkFalsy: true })
        .withMessage('User is required'),
    check('secretCode')
        .exists({ checkFalsy: true })
        .withMessage('secretCode is required'),
    check('guessHistory')
        .exists({ checkFalsy: true })
        .withMessage('guessHistory is required'),
    check('attemptsLeft')
        .exists({ checkFalsy: true })
        .withMessage('attemptsLeft is required'),
    check('gameState')
        .exists({ checkFalsy: true })
        .withMessage('gameState is required'),
    handleValidationErrors
];

module.exports = validateGameInput;
