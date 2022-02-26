const jwt = require('jsonwebtoken')
const { gameModel } = require('../../models/game')

module.exports = (request, response) => {

    const token = request.headers.authorization
    const decoded = jwt.decode(token, {complete: true})

    gameModel
        .findOne()
        .or([{ player1: request.params.opponent, player2: decoded.payload.name, in_progress: true }, 
            { player1: decoded.payload.name ,player2: request.params.opponent, in_progress: true }])
        .then(game => {
            const round = game.rounds[request.body.round - 1]

            if (game.player1 == decoded.payload.name) {
                round.p1_move = request.body.move
            } else {
                round.p2_move = request.body.move
            }

            game.save().then(() => {
                response.status(200).end()
            }).catch(error => {
                console.error(error)

                response.status(500).json({
                    message: 'Error al intentar modificar una partida'
                })
            })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error al intentar modificar una partida'
            })
        })
}