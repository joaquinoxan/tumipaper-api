const jwt = require('jsonwebtoken')
const { gameModel } = require('../../models/game')

module.exports = (request, response) => {

    const token = request.headers.authorization
    const decoded = jwt.decode(token, {complete: true})
    var wincont = 0
    var drawcont = 0


    gameModel
        .findOne()
        .or([{ player1: request.params.opponent, player2: decoded.payload.name, in_progress: true }, 
            { player1: decoded.payload.name ,player2: request.params.opponent, in_progress: true }])
        .then(game => {
            game.rounds.forEach(round => {
                if (round.winner == game.player1){
                    wincont++
                }
                if (round.winner == ''){
                    drawcont++
                }
            });
            if (wincont >= 2) {
                game.winner = game.player1
            } else {
                if (drawcont < 2) {
                    game.winner = game.player2
                }
            }
            game.in_progress = false

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