const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    userModel
        .find()
        .select('-password')
        .then(users => {
            userModel
                .count()
                .then(count => {
                    const meta = {
                        count
                    }

                    response.status(200).json({
                        meta,
                        users
                    })
                }).catch(error => {
                    console.error(error)
            
                    response.status(500).json({
                        message: 'Error al intentar listar los usuarios'
                    })
                })
        }).catch(error => {
            console.error(error)

            response.status(500).json({
                message: 'Error al intentar listar los usuarios'
            })
        })

}