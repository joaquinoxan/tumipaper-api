const { model, Schema } = require('mongoose')

const roundSchema = new Schema({
    round: {
        type: Number,
        required: true,
        trim: true,
    },
    p1_move: {
        type: String,
        required: true,
        trim: true,
    },
    p2_move: {
        type: String,
        required: true,
        trim: true,
    },
    winner: {
        type: String,
        trim: true,
    }
})

module.exports = {
    roundSchema
}