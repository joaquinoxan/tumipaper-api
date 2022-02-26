const jwt = require('jsonwebtoken')
const { gameModel } = require('../../models/game')

module.exports = (request, response) => {

    const token = request.headers.authorization
    const decoded = jwt.decode(token, {complete: true})

    gameModel
        .find()
        .or([{ player2: decoded.payload.name, in_progress: true }, 
            { player1: decoded.payload.name, in_progress: true }])
        .then(games => {
            gameModel
                .count()
                .or([{ player2: decoded.payload.name, in_progress: true }, 
                    { player1: decoded.payload.name, in_progress: true }])
                .then(count => {
                    const meta = {
                        count
                    }

                    response.status(200).json({
                        meta,
                        games
                    })
                }).catch(error => {
                    console.error(error)
            
                    response.status(500).json({
                        message: 'Error al intentar listar las partidas'
                    })
                })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error al intentar listar las partidas'
            })
        })

}