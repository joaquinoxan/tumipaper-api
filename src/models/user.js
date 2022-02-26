const { model, Schema } = require('mongoose')

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
})

const userModel = model('users', userSchema)

module.exports = {
    userSchema,
    userModel
}
