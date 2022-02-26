const jwt = require('jsonwebtoken')
const { gameModel } = require('../../models/game')

module.exports = (request, response) => {

    const token = request.headers.authorization
    const decoded = jwt.decode(token, {complete: true})

    gameModel
        .find()
        .or([{ player2: decoded.payload.name }, 
            { player1: decoded.payload.name }])
        .then(games => {
            gameModel
                .count()
                .or([{ player2: decoded.payload.name }, 
                    { player1: decoded.payload.name }])
                .then(games_played => {
                    gameModel
                    .count({winner: decoded.payload.name})
                    .then(games_won => {
                        const meta = {
                            games_played,
                            games_won
                        }
    
                        response.status(200).json({
                            meta,
                            games
                        })
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


