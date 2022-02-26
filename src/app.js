// Utilidad para leer variables de entorno (archivo .env)
require('dotenv').config()

const mongoose = require('mongoose')
const mongooseToJson = require('@meanie/mongoose-to-json')
const express = require('express')
const cors =  require('cors')
const getDbConnectionString = require('./utils/get-db-connection-string')

// ############################
// Configuracion de plugins para la BD
// ############################

mongoose.plugin(mongooseToJson)

// ############################
// Creacion de app express
// ############################

const app = express()

// ############################
// Middlewares
// ############################

const checkUserCredentials = require('./middlewares/check-user-credentials')

app.use(cors())
app.use(express.json())

// ############################
// Carga de controladores
// ############################


// Users
const login = require('./controllers/user/login')
const register = require('./controllers/user/register')
const getUsers = require('./controllers/user/get-all')
const newGame = require('./controllers/game/create')
const getGame = require('./controllers/game/get-by-name')
const patchGame = require('./controllers/game/patch')
const evaluateRound = require('./controllers/game/evaluate-round')
const evaluateGame = require('./controllers/game/evaluate-game')
const getUserGames = require('./controllers/game/get-user-games')
const getUserGamesInProgress = require('./controllers/game/get-user-games-inprogress')
const getUserStats = require('./controllers/game/get-user-stats')

// ############################
// Definicion de rutas
// ############################


// Users
app.post('/login', login)
app.post('/register', register)
app.get('/users', checkUserCredentials, getUsers)
app.get('/user/games', checkUserCredentials, getUserGames)
app.get('/user/games/inprogress', checkUserCredentials, getUserGamesInProgress)
app.get('/user/stats', checkUserCredentials, getUserStats)

// Games

app.post('/game/:opponent', checkUserCredentials, newGame)
app.get('/game/:opponent', checkUserCredentials, getGame)
app.patch('/game/:opponent', checkUserCredentials, patchGame)
app.patch('/game/:opponent/evaluate', checkUserCredentials, evaluateRound)
app.patch('/game/:opponent/evaluategame', checkUserCredentials, evaluateGame)


mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // Comenzar a escuchar por conexiones
        app.listen(process.env.PORT)
    }).catch(error => {
        console.error('No fue posible conectarse a la base de datos', error)
    })