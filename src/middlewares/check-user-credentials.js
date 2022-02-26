const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
    // Obtenemos token del header
    const token = request.headers.authorization

    try {
        // Valido que el token enviado por el usuario sea correcto
        const decoded = jwt.verify(token, process.env.JWT_KEY)

        // Invoco al siguiente middleware
        next()
    } catch(error) {
        console.error('Error en token', error)

        // Retorno error 401 en caso de que el token es invalido
        return response.status(401).json({
            message: 'Credenciales invalidas'
        })
    }
}