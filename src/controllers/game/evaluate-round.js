const jwt = require('jsonwebtoken')
const { gameModel } = require('../../models/game')

function evaluateMoves(p1, p2) {
    if (p1 == 'rock' && p2 == 'sccisors') {
        return 'WIN'
    }
    if (p1 == 'rock' && p2 == 'paper') {
        return 'LOSS'
    }
    if (p1 == 'rock' && p2 == 'rock') {
        return 'DRAW'
    }
    if (p1 == 'paper' && p2 == 'rock') {
        return 'WIN'
    }
    if (p1 == 'paper' && p2 == 'sccisors') {
        return 'LOSS'
    }
    if (p1 == 'paper' && p2 == 'paper') {
        return 'DRAW'
    }
    if (p1 == 'sccisors' && p2 == 'paper') {
        return 'WIN'
    }
    if (p1 == 'sccisors' && p2 == 'rock') {
        return 'LOSS'
    }
    if (p1 == 'sccisors' && p2 == 'sccisors') {
        return 'DRAW'
    }         
}

module.exports = (request, response) => {

    const token = request.headers.authorization
    const decoded = jwt.decode(token, {complete: true})


    gameModel
        .findOne()
        .or([{ player1: request.params.opponent, player2: decoded.payload.name, in_progress: true }, 
            { player1: decoded.payload.name ,player2: request.params.opponent, in_progress: true }])
        .then(game => {
            const round = game.rounds[request.query.round - 1]
            const result = evaluateMoves(round.p1_move, round.p2_move)

            if (result == 'WIN') {
                round.winner = game.player1
            }
            if (result == 'LOSS') {
                round.winner = game.player2
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