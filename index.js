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
const myPositions = []

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

function chooseMove (chosenFood, mySnakeHead) {
  console.log('chosenFood', chosenFood, 'mySnakeHead', mySnakeHead)
  if (chosenFood.x > mySnakeHead.x) {
    return {move: 'right'}
  } else if (chosenFood.x < mySnakeHead.x) {
    return {move: 'left'}
  }
  if (chosenFood.y > mySnakeHead.y) {
    return {move: 'down'}
  } else if (chosenFood.y < mySnakeHead.y) {
    return {move: 'up'}
  }

  // TO DO: avoid walls 

  // TO DO: avoid collisions
}

//fn to pick which food to go after
function chooseFoodToEat (foodPositions) {
  return foodPositions[0]
}

// Handle POST request to '/move'
app.post('/move', (request, response) => {  
  
  let foodPositions = request.body.board.food
  let mySnake = request.body.you
  let mySnakeHead = request.body.you.body[0]
 
  console.log(foodPositions, mySnake)


  let chosenFood = chooseFoodToEat(foodPositions)
  let chosenMove = chooseMove(chosenFood, mySnakeHead) 


  console.log('move picked: ', chosenMove)

  return response.json(chosenMove)
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
