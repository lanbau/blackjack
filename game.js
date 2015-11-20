var cards = require('cards')
var deck = new cards.PokerDeck() // Create a new 52 card poker deck
deck.shuffleAll() // Shuffle the deck
class Player {
  constructor (name) {
    this.hand = []
    this.name = name
  }
}
// Initialise Game - Do Not Call com.hand[1] - Bug in NPM Card NEVER CHANGES
// use com.hand[2] as second hand
var com = new Player('com')
var playerOne = new Player('one')
var players = [com, playerOne]
players.forEach(player => {
  player.hand.push(...deck.draw(2))
})

render()
function render () {
  // clear the screen
  document.querySelector('main').innerHTML = ''
  // create computer area
  function addAreaToMain (type, cname) {
    var elt = document.createElement(type)
    elt.className = cname
    document.querySelector('main').appendChild(elt)
  }
  addAreaToMain('h1', 'cname')
  insertName('.cname', 'Computer')
  addAreaToMain('ul', 'com')
  addAreaToMain('div', 'comscore')
  addAreaToMain('h1', 'pname')
  insertName('.pname', 'Player')
  addAreaToMain('ul', 'player')
  addAreaToMain('div', 'playerscore')
  addAreaToMain('ul', 'button')

  function insertName (pos, text) {
    var c = document.querySelector(pos)
    c.innerHTML = text
    c.style.color = 'white'
    c.style.textAlign = 'center'
  }
  // variables
  var ccard1 = com.hand[0].unicodeString()
  var ccard2 = com.hand[1].unicodeString()
  var cvalue1 = com.hand[0].value
  var cvalue2 = com.hand[1].value
  var pcard1 = playerOne.hand[0].unicodeString()
  var pcard2 = playerOne.hand[1].unicodeString()
  var pvalue1 = playerOne.hand[0].value
  var pvalue2 = playerOne.hand[1].value

  // draw the deck
  drawDeck('com', ccard1)
  drawDeck('com', ccard2)
  drawDeck('player', pcard1)
  drawDeck('player', pcard2)

  // draw the buttons
  drawButton('button', 'hitbutton', 'red', 'white', 'Hit')
  drawButton('button', 'standbutton', 'blue', 'white', 'Stand')
  // draw the scores
  var comInitialScore = drawInitalScore('comscore', cvalue1, cvalue2)
  comInitialScore
  var playerInitialScore = drawInitalScore('playerscore', pvalue1, pvalue2)
  playerInitialScore

  if (playerInitialScore === 21) {
    console.log('BLACKJACK!')
    disableButton('.hitbutton')
    disableButton('.standbutton')
  }
  if (playerInitialScore === 22 && pvalue1 === 'A' && pvalue2 === 'A') {
    document.querySelector('.playerscore').innerHTML = 21
  }
  // HIT BUTTON
  var hitbutton = document.querySelector('.hitbutton')
  var click = 0
  hitbutton.addEventListener('click', function () {
    playerOne.hand.push(deck.draw())
    drawDeck('player', playerOne.hand[click + 2].unicodeString())
    var playerhand = playerOne.hand
    drawNewScore('.playerscore', playerhand)
    click++
    if (getPlayerScore() > 21) {
      disableButton('.hitbutton')
      disableButton('.standbutton')
      console.log('PLAYER BUST. NOOB!')
    }
  })
  // STAND BUTTON
  var standbutton = document.querySelector('.standbutton')
  var click1 = 0
  standbutton.addEventListener('click', function () {
    for (var i = 0; i < 5; i++) {
      if (getComScore() < 17) {
        disableButton('.hitbutton')
        com.hand.push(deck.draw())
        drawDeck('com', com.hand[click1 + 2].unicodeString())
        var comhand = com.hand
        drawNewScore('.comscore', comhand)
        click1++
      }
    }
    checkWinner(getComScore(), getPlayerScore())
  })
}
function disableButton (button) {
  document.querySelector(button).disabled = true
}
function checkWinner (cscore, pscore) {
  checkTie(cscore, pscore)
  didComWin(cscore, pscore)

  function checkTie (cscore, pscore) {
    if (pscore === cscore) {
      console.log('TIE')
    }
  }
  function didComWin (cscore, pscore) {
    if (cscore < 21 || cscore === 21) {
      if (cscore > pscore) {
        console.log('COM WINS!')
      }
    } else {
      console.log('COM BUST! PLAYER WINS!')
    }
  }
}
function getComScore () {
  return parseInt(document.querySelector('.comscore').innerHTML, 10)
}
function getPlayerScore () {
  return parseInt(document.querySelector('.playerscore').innerHTML, 10)
}
function drawNewScore (pos, hand) {
  var s = document.querySelector(pos)
  s.style.color = 'white'
  s.style.fontSize = '2em'
  s.style.textAlign = 'center'
  var hand1 = hand.map(function (e) {
    return getNewInt(e.value)
  })
  var sum = hand1.reduce(function (p, e) {
    return p + e
  })
  s.innerHTML = sum
}
// Ace value for 3rd card and above is 1
function getNewInt (a) {
  if (a === 'K' || a === 'Q' || a === 'J') {
    return 10
  } else {
    if (a === 'A') {
      return 1
    } else {
      return parseInt(a, 10)
    }
  }
}
// Initial Ace Value is 11
function getInt (a) {
  if (a === 'K' || a === 'Q' || a === 'J') {
    return 10
  } else {
    if (a === 'A') {
      return 11
    } else {
      return parseInt(a, 10)
    }
  }
}
function drawInitalScore (pos, hand1, hand2) {
  var s = document.querySelector('.' + pos)
  var score = getInt(hand1) + getInt(hand2)
  s.innerHTML = score
  s.style.color = 'white'
  s.style.fontSize = '2em'
  s.style.textAlign = 'center'
  return score
}

function drawDeck (pos, unicode) {
  var deck = document.createElement('li')
  deck.className = 'card'
  deck.style.backgroundColor = 'white'
  deck.style.width = '70px'
  deck.style.height = '85px'
  deck.style.borderRadius = '10px'
  deck.style.display = 'inline'
  deck.style.margin = '10px'
  deck.style.fontSize = '2em'
  deck.style.paddingLeft = '15px'
  deck.style.paddingTop = '30px'
  deck.innerHTML = unicode
  document.querySelector('.' + pos).appendChild(deck)
}
function drawButton (pos, classid, bgcolour, fontcolour, text) {
  var deck = document.createElement('button')
  deck.className = classid
  deck.style.backgroundColor = bgcolour
  deck.style.color = fontcolour
  deck.style.width = '80px'
  deck.style.height = '30px'
  deck.style.borderRadius = '10px'
  deck.style.display = 'inline'
  deck.style.margin = '10px'
  deck.style.paddingLeft = '5px'
  deck.style.fontSize = '1em'
  deck.innerHTML = text
  document.querySelector('.' + pos).appendChild(deck)
}
