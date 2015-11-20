function total (a, b) {
  function getScore (card) {
    return (card === 'K' || a === 'Q' || a === 'J' || a === 'A')
      ? 10 : parseInt(a, 10)
  }
  return getScore(a) + getScore(b)
}
function toInt (a) {
  if (a === 'K' || a === 'Q' || a === 'J' || a === 'A') {
    a = 10
  }
  else { a = parseInt(a, 10) }
  return a
}

class Player {
  constructor (name) {
    this.hand = []
    this.name = name
  }
}

// Initialise Game
var com = new Player('com')
var playerOne = new Player('one')
var players = [com, playerOne]
players.forEach(player => {
  player.hand.push(...deck.draw(2))
})
render()

function render () {
  // clear the screen
  //document.getElementById(main) = ""
  // draw the deck
  // draw the players
  drawPlayers()
  // draw the buttons
  // draw the scores
}

function drawPlayers () {
  players.forEach(player => {

  })
}
