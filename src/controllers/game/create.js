const jwt = require('jsonwebtoken')
const { gameModel } = require('../../models/game')

module.exports = (request, response) => {

    const token = request.headers.authorization
    const decoded = jwt.decode(token, {complete: true})

    gameModel.create({
        player1: decoded.payload.name,
        player2: request.params.opponent,
        in_progress: true,
        winner: '',
        rounds: [
            {
                round: 1,
                p1_move: 'pending',
                p2_move: 'pending',
                winner: ''
            },
            {
                round: 2,
                p1_move: 'pending',
                p2_move: 'pending',
                winner: ''
            },
            {
                round: 3,
                p1_move: 'pending',
                p2_move: 'pending',
                winner: ''
            }
        ]
    }).then(game => {
        const userWithoutPassword = game.toObject()

        response.json({
            game: userWithoutPassword
        })
    }).catch(error => {
        console.error(error)

        response.status(500).json({
            message: 'No se crear la partida',
        })
    })
}