const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const { userModel } = require('../../models/user')

module.exports = (request, response) => {
        const user = request.body

        const schema = Joi.object({
            name: Joi.string()
                .alphanum()
                .required(),
            password: Joi.string()
                .min(7)
                .max(50)
                .required(),
        })
    
        const validationResult = schema.validate(user)
    
        if (!validationResult.error) {
            user.password = bcrypt.hashSync(user.password, 2)
    
            userModel.create({
                password: user.password,
                name: user.name,
            }).then(user => {
                const userWithoutPassword = user.toObject()

                delete userWithoutPassword.password

                // Agregamos token de usuario
                userWithoutPassword.token = jwt.sign({
                    id: userWithoutPassword._id,
                    name: userWithoutPassword.name
                }, process.env.JWT_KEY, { expiresIn: '1h' })

                response.json({
                    user: userWithoutPassword
                })
            }).catch(error => {
                console.error(error)

                response.status(500).json({
                    message: 'No se pudo registrar el usuario',
                })
            })
        } else {
            response.status(400).json({
                message: validationResult.error
            })
        }
    }