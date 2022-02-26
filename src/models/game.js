const { model, Schema } = require('mongoose')
const { roundSchema } = require('./round')

const gameSchema = new Schema({
    player1: {
        type: String,
        required: true,
        trim: true,
    },
    player2: {
        type: String,
        required: true,
        trim: true,
    },
    in_progress: {
        type: Boolean,
        required: true,
    },
    winner: {
        type: String,
        trim: true
    },
    rounds: {
        type: [roundSchema],
        default: () => ([])
    }
})

const gameModel = model('games', gameSchema)

module.exports = {
    gameSchema,
    gameModel
}