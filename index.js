const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

const food = []

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game
  // Response data
  const data = {
    color: '#ff69b0',
    headType: 'bendr',
    tailType: 'hook'
  }
  console.log('\n\n\n\n\n NEW GAME \n\n\n\n\n\n')

  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {  
  // get food positions and my position 
  let food = request.body.board.food
  let mySnake = request.body.you
  console.log(food, mySnake)

  // pick move based on food positions and my position
  let directions = ['up','down','left','right']
  let chosenMove = directions[Math.floor(Math.random() * directions.length)]

  console.log('move picked: ', chosenMove)

  return response.json({move: chosenMove})
})


app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
})

app.get('/snakeRequest', (request,reponse) => {
  console.log(request )
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
