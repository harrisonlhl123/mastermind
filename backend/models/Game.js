const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    secretCode: {
        type: [Number],
        required: true
    },
    guessHistory: {
        type: [{
            guess: {
                type: [Number],
            },
            exactMatches: {
                type: Number,
            },
            nearMatches: {
                type: Number,
            }
        }],
        required: true
    },
    attemptsLeft: {
        type: Number,
        required: true
    },
    gameState: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);