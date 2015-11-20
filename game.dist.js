(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cards = require('cards');
var deck = new cards.PokerDeck(); // Create a new 52 card poker deck
deck.shuffleAll(); // Shuffle the deck

var Player = function Player(name) {
  _classCallCheck(this, Player);

  this.hand = [];
  this.name = name;
};
// Initialise Game - Do Not Call com.hand[1] - Bug in NPM Card NEVER CHANGES
// use com.hand[2] as second hand

var com = new Player('com');
var playerOne = new Player('one');
var players = [com, playerOne];
players.forEach(function (player) {
  var _player$hand;

  (_player$hand = player.hand).push.apply(_player$hand, _toConsumableArray(deck.draw(2)));
});

render();
function render() {
  // clear the screen
  document.querySelector('main').innerHTML = '';
  // create computer area
  function addAreaToMain(type, cname) {
    var elt = document.createElement(type);
    elt.className = cname;
    document.querySelector('main').appendChild(elt);
  }
  addAreaToMain('h1', 'cname');
  insertName('.cname', 'Computer');
  addAreaToMain('ul', 'com');
  addAreaToMain('div', 'comscore');
  addAreaToMain('h1', 'pname');
  insertName('.pname', 'Player');
  addAreaToMain('ul', 'player');
  addAreaToMain('div', 'playerscore');
  addAreaToMain('ul', 'button');

  function insertName(pos, text) {
    var c = document.querySelector(pos);
    c.innerHTML = text;
    c.style.color = 'white';
    c.style.textAlign = 'center';
  }
  // variables
  var ccard1 = com.hand[0].unicodeString();
  var ccard2 = com.hand[1].unicodeString();
  var cvalue1 = com.hand[0].value;
  var cvalue2 = com.hand[1].value;
  var pcard1 = playerOne.hand[0].unicodeString();
  var pcard2 = playerOne.hand[1].unicodeString();
  var pvalue1 = playerOne.hand[0].value;
  var pvalue2 = playerOne.hand[1].value;

  // draw the deck
  drawDeck('com', ccard1);
  drawDeck('com', ccard2);
  drawDeck('player', pcard1);
  drawDeck('player', pcard2);

  // draw the buttons
  drawButton('button', 'hitbutton', 'red', 'white', 'Hit');
  drawButton('button', 'standbutton', 'blue', 'white', 'Stand');
  // draw the scores
  var comInitialScore = drawInitalScore('comscore', cvalue1, cvalue2);
  comInitialScore;
  var playerInitialScore = drawInitalScore('playerscore', pvalue1, pvalue2);
  playerInitialScore;

  if (playerInitialScore === 21) {
    console.log('BLACKJACK!');
    disableButton('.hitbutton');
    disableButton('.standbutton');
  }
  if (playerInitialScore === 22 && pvalue1 === 'A' && pvalue2 === 'A') {
    document.querySelector('.playerscore').innerHTML = 21;
  }
  // HIT BUTTON
  var hitbutton = document.querySelector('.hitbutton');
  var click = 0;
  hitbutton.addEventListener('click', function () {
    playerOne.hand.push(deck.draw());
    drawDeck('player', playerOne.hand[click + 2].unicodeString());
    var playerhand = playerOne.hand;
    drawNewScore('.playerscore', playerhand);
    click++;
    if (getPlayerScore() > 21) {
      disableButton('.hitbutton');
      disableButton('.standbutton');
      console.log('PLAYER BUST. NOOB!');
    }
  });
  // STAND BUTTON
  var standbutton = document.querySelector('.standbutton');
  var click1 = 0;
  standbutton.addEventListener('click', function () {
    for (var i = 0; i < 5; i++) {
      if (getComScore() < 17) {
        disableButton('.hitbutton');
        com.hand.push(deck.draw());
        drawDeck('com', com.hand[click1 + 2].unicodeString());
        var comhand = com.hand;
        drawNewScore('.comscore', comhand);
        click1++;
      }
    }
    checkWinner(getComScore(), getPlayerScore());
  });
}
function disableButton(button) {
  document.querySelector(button).disabled = true;
}
function checkWinner(cscore, pscore) {
  checkTie(cscore, pscore);
  didComWin(cscore, pscore);

  function checkTie(cscore, pscore) {
    if (pscore === cscore) {
      console.log('TIE');
    }
  }
  function didComWin(cscore, pscore) {
    if (cscore < 21 || cscore === 21) {
      if (cscore > pscore) {
        console.log('COM WINS!');
      }
    } else {
      console.log('COM BUST! PLAYER WINS!');
    }
  }
}
function getComScore() {
  return parseInt(document.querySelector('.comscore').innerHTML, 10);
}
function getPlayerScore() {
  return parseInt(document.querySelector('.playerscore').innerHTML, 10);
}
function drawNewScore(pos, hand) {
  var s = document.querySelector(pos);
  s.style.color = 'white';
  s.style.fontSize = '2em';
  s.style.textAlign = 'center';
  var hand1 = hand.map(function (e) {
    return getNewInt(e.value);
  });
  var sum = hand1.reduce(function (p, e) {
    return p + e;
  });
  s.innerHTML = sum;
}
// Ace value for 3rd card and above is 1
function getNewInt(a) {
  if (a === 'K' || a === 'Q' || a === 'J') {
    return 10;
  } else {
    if (a === 'A') {
      return 1;
    } else {
      return parseInt(a, 10);
    }
  }
}
// Initial Ace Value is 11
function getInt(a) {
  if (a === 'K' || a === 'Q' || a === 'J') {
    return 10;
  } else {
    if (a === 'A') {
      return 11;
    } else {
      return parseInt(a, 10);
    }
  }
}
function drawInitalScore(pos, hand1, hand2) {
  var s = document.querySelector('.' + pos);
  var score = getInt(hand1) + getInt(hand2);
  s.innerHTML = score;
  s.style.color = 'white';
  s.style.fontSize = '2em';
  s.style.textAlign = 'center';
  return score;
}

function drawDeck(pos, unicode) {
  var deck = document.createElement('li');
  deck.className = 'card';
  deck.style.backgroundColor = 'white';
  deck.style.width = '70px';
  deck.style.height = '85px';
  deck.style.borderRadius = '10px';
  deck.style.display = 'inline';
  deck.style.margin = '10px';
  deck.style.fontSize = '2em';
  deck.style.paddingLeft = '15px';
  deck.style.paddingTop = '30px';
  deck.innerHTML = unicode;
  document.querySelector('.' + pos).appendChild(deck);
}
function drawButton(pos, classid, bgcolour, fontcolour, text) {
  var deck = document.createElement('button');
  deck.className = classid;
  deck.style.backgroundColor = bgcolour;
  deck.style.color = fontcolour;
  deck.style.width = '80px';
  deck.style.height = '30px';
  deck.style.borderRadius = '10px';
  deck.style.display = 'inline';
  deck.style.margin = '10px';
  deck.style.paddingLeft = '5px';
  deck.style.fontSize = '1em';
  deck.innerHTML = text;
  document.querySelector('.' + pos).appendChild(deck);
}

},{"cards":2}],2:[function(require,module,exports){
/**
 * Playing Card Module
 *
 * @author     James Brumond
 * @copyright  Copyright 2012 James Brumond
 * @license    Dual licensed under MIT and GPL
 *
 * ----------------------------------------------
 *
 * cards.useArc4 boolean
 * 
 * cards.Card ( string suit, string value )
 *       Card::suit string
 *       Card::value string
 *       Card::deck Deck
 *       Card::unicodeString ( void )
 * 
 * cards.Pile < Array ( void )
 *       Pile::empty ( void )
 *       Pile::emptyInto ( mixed arr )
 *       Pile::copyInto ( mixed arr )
 *       Pile::shiftInto ( mixed arr )
 * 
 * cards.Deck ( mixed generator )
 *       Deck::add ( Card card[, object cfg ])
 *       Deck::remove ( Card card )
 *       Deck::draw ([ number count ])
 *       Deck::drawToDiscard ([ number count ])
 *       Deck::discard ( mixed card )
 *       Deck::find ( mixed card )
 *       Deck::shuffleAll ( void )
 *       Deck::shuffleRemaining ( void )
 *       Deck::shuffleDiscard ( void )
 *       Deck::discardAllHeld ( void )
 * 
 * cards.PokerDeck < Deck ([ object cfg { jokers: number } ])
 * cards.OldMaidDeck < Deck ( void )
 * cards.EuchreDeck < Deck ( void )
 * cards.PinochelDeck < Deck ( void )
 * cards.PiquetDeck < Deck ( void )
 * cards.BarajaDeck < Deck ( void )
 * cards.generators { name: function }
 */

var rand = require('rand-utils');

exports.useArc4 = false;

// ------------------------------------------------------------------
//  @class  Card

var Card = exports.Card = function(suit, value) {
	this.suit   = suit;
	this.value  = String(value);
	this.deck   = null;
};

Card.prototype.toString = function() {
	return '[Card ' + this.suit + ':' + this.value + ']';
};

Card.prototype.unicodeString = function() {
	var suit = Card.suitUnicodeStrings[this.suit] || this.suit;
	return this.value + suit;
};

Card.suitUnicodeStrings = {
	heart:    '♥',
	diamond:  '♦',
	club:     '♣',
	spade:    '♠',
	sword:    '☨',
	coin:     '⚪',
	cup:      '☕'
};

// ------------------------------------------------------------------
//  @class  Pile < Array

var Pile = exports.Pile = function() {
	Array.call(this);
};
Pile.prototype = new Array();

/**
 * Empty out the pile
 *
 * @access  public
 * @return  array
 */
Pile.prototype.empty = function() {
	return this.splice(0, this.length);
};

/**
 * Copy all values into a different pile
 *
 * @access  public
 * @param   object    an array-like object
 * @return  void
 */
Pile.prototype.copyInto = function(arr) {
	arr.push.apply(arr, this.slice());
};

/**
 * Empty all values and move them into a different pile
 *
 * @access  public
 * @param   object    an array-like object
 * @return  void
 */
Pile.prototype.emptyInto = function(arr) {
	arr.push.apply(arr, this.empty());
};

/**
 * Shift off the first value and push it onto a different pile
 *
 * @access  public
 * @param   object    an array-like object
 * @return  mixed
 */
Pile.prototype.shiftInto = function(arr) {
	var value = this.shift();
	arr.push(value);
	return value;
};

// ------------------------------------------------------------------
//  @class  Deck

var piles = ['deck', 'discard', 'held'];

var Deck = exports.Deck = function(generator) {
	this.cards    = new Pile();
	this.deck     = new Pile();
	this.held     = new Pile();
	this.discard  = new Pile();
	
	if (generator) {
		if (typeof generator === 'string') {
			generator = exports.generators[generator];
		}
		generator(this);
	}
};

/**
 * Add a card to the deck
 *
 * @access  public
 * @param   object    the card object
 * @param   object    {pile: string}
 * @return  void
 */
Deck.prototype.add = function(card, cfg) {
	if (card.deck) {
		card.deck.remove(card);
	}
	card.deck = this;
	
	var pile = (cfg && cfg.pile) ? cfg.pile : 'deck';
	if (piles.indexOf(pile) < 0) {
		throw new Error('Cannot add card to non-existent pile "' + pile + '"');
	}
	
	this.cards.push(card);
	this[pile].push(card);
};

/**
 * Remove a card from the deck
 *
 * @access  public
 * @param   object    the card object
 * @return  void
 */
Deck.prototype.remove = function(card) {
	var self = this;
	
	Deck._remove(this.cards, card);
	piles.forEach(function(pile) {
		Deck._remove(self[pile], card);
	});
	
	card.deck = null;
};

Deck._remove = function(pile, card) {
	var index = pile.indexOf(card);
	if (index >= 0) {
		pile.splice(index, 1);
	}
};

/**
 * Draw a card(s) from the deck
 *
 * @access  public
 * @param   number    the number of cards to draw
 * @param   object    the deck to draw into
 * @return  object
 */
Deck.prototype.draw = function(count, _into) {
	var self = this;
	
	if (! this.deck.length) {
		throw new RangeError('Cannot draw card from deck; No cards remaining.');
	}
	
	if (! count){
		return this.deck.shiftInto(_into || this.held);
	}
	
	var cards = [ ];
	for (var i = 0; i < count; i++){	
		cards.push(self.draw(0, _into || this.held));
	}
	
	return cards;
};

/**
 * Draw a card(s) from the deck and discard
 *
 * @access  public
 * @param   number    the number of cards to draw
 * @return  object
 */
Deck.prototype.drawToDiscard = function(count) {
	return this.draw(count, this.discard);
};

/**
 * Discard a card
 *
 * @access  public
 * @param   object    the card object
 * @return  void
 */
Deck.prototype.discard = function(card) {
	if (Array.isArray(card) && typeof card[0] !== 'string') {
		card.forEach(this.discard.bind(this));
	}
	
	card = this.find(card);
	if (! card) {
		throw new Error('Given "card" value does not belong to this deck');
	}
	card.pile.splice(card.index, 1);
	this.discard.push(card.card);
};

/**
 * Find a card object and its location
 *
 * @access  public
 * @param   object    the card to find
 * @return  object
 */
Deck.prototype.find = function(card) {
	var self = this;
	if (Array.isArray(card)) { // Allow card to be an array [suit, value]
		var cards = [ ];
		card[1] = String(card[1]);
		for (var i = 0, c = this.cards.length; i < c; i++) {
			if (this.cards[i].suit === card[0] && this.cards[i].value === card[1]) {
				cards.push(this.cards[i]);
			}
		}
		return cards.map(this.find.bind(this));
	}
	if (! card instanceof Card) {
		throw new Error('Cannot find non-card value');
	}
	var ret = null;
	piles.forEach(function(pile) {
		if (! ret) {
			var index = self[pile].indexOf(card);
			if (index >= 0) {
				ret = [{
					index: index,
					pileName: pile,
					pile: self[pile],
					card: card
				}];
			}
		}
	});
	return ret;
};

/**
 * Shuffle all cards into the deck pile
 *
 * @access  public
 * @return  void
 */
Deck.prototype.shuffleAll = function() {
	this.held.empty();
	this.discard.empty();
	this.deck.empty();
	this.cards.copyInto(this.deck);
	this.shuffleRemaining();
};

/**
 * Shuffle all cards remaining in the deck
 *
 * @access  public
 * @return  void
 */
Deck.prototype.shuffleRemaining = function() {
	rand.shuffle(this.deck, exports.useArc4 ? 'ARC4' : 'SIMPLE');
};

/**
 * Shuffle the discard pile and append them to the deck
 *
 * @access  public
 * @return  void
 */
Deck.prototype.shuffleDiscard = function() {
	rand.shuffle(this.discard, exports.useArc4 ? 'ARC4' : 'SIMPLE');
	this.discard.emptyInto(this.deck);	
};

/**
 * Move all cards in the held pile to discard
 *
 * @access  public
 * @return  void
 */
Deck.prototype.discardAllHeld = function() {
	this.held.emptyInto(this.discard);
};

/**
 * Creates new simple deck constructors
 */
Deck.createType = function(name, generator, constructor) {
	exports[name] = function() {
		Deck.call(this, generator);
		if (typeof constructor === 'function') {
			constructor.apply(this, arguments);
		}
	};
};

// ------------------------------------------------------------------
//  @class  PokerDeck

var PokerDeck = exports.PokerDeck = function(cfg) {
	Deck.call(this, 'poker');
	if (cfg && cfg.jokers) {
		for (var i = 0; i < cfg.jokers; i++) {
			this.add(new Card('other', 'joker'));
		}
	}
};

PokerDeck.prototype = new Deck();

// ------------------------------------------------------------------
//  @class  OldMaidDeck

var OldMaidDeck = exports.OldMaidDeck = function() {
	Deck.call(this, 'oldMaid');
};

OldMaidDeck.prototype = new Deck();

// ------------------------------------------------------------------
//  @class  EuchreDeck

var EuchreDeck = exports.EuchreDeck = function() {
	Deck.call(this, 'euchre');
};

EuchreDeck.prototype = new Deck();

// ------------------------------------------------------------------
//  @class  PinochelDeck

var PinochelDeck = exports.PinochelDeck = function() {
	Deck.call(this, 'pinochel');
};

PinochelDeck.prototype = new Deck();

// ------------------------------------------------------------------
//  @class  PiquetDeck

var PiquetDeck = exports.PiquetDeck = function() {
	Deck.call(this, 'piquet');
};

PiquetDeck.prototype = new Deck();

// ------------------------------------------------------------------
//  @class  BarajaDeck

var BarajaDeck = exports.BarajaDeck = function() {
	Deck.call(this, 'baraja');
};

BarajaDeck.prototype = new Deck();

// ------------------------------------------------------------------
//  @object  generators

exports.generators = {
	poker: function(deck) {
		['club', 'diamond', 'heart', 'spade'].forEach(function(suit) {
			[2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'].forEach(function(value) {
				deck.add(new Card(suit, value));
			});
		});
	},
	
	oldMaid: function(deck) {
		exports.generators.poker(deck);
		deck.add(new Card('other', 'maid'));
	},
	
	euchre: function(deck) {
		['club', 'diamond', 'heart', 'spade'].forEach(function(suit) {
			[9, 10, 'J', 'Q', 'K', 'A'].forEach(function(value) {
				deck.add(new Card(suit, value));
			});
		});
	},
	
	pinochel: function(deck) {
		exports.generators.euchre(deck);
		exports.generators.euchre(deck);
	},
	
	piquet: function(deck) {
		['club', 'diamond', 'heart', 'spade'].forEach(function(suit) {
			[7, 8, 9, 10, 'J', 'Q', 'K', 'A'].forEach(function(value) {
				deck.add(new Card(suit, value));
			});
		});
	},

	baraja: function(deck){
		['sword', 'club', 'coin', 'cup'].forEach(function(suit) {
			[1, 2, 3, 4, 5, 6, 7, 10, 11, 12].forEach(function(value) {
				deck.add(new Card(suit, value));
			});
		});
	}

};


},{"rand-utils":3}],3:[function(require,module,exports){
/**
 * Randomization module
 *
 * @author     James Brumond
 * @version    0.0.1
 * @copyright  Copyright 2011 James Brumond
 * @license    Dual licensed under MIT and GPL
 *
 * ------------------------------------------------------------------
 *
 * Methods:
 *   number    rand.double ([ string prng = 'SIMPLE' ])
 *   number    rand.int ([ object options { min, max, gen } ])
 *   number    rand.getGenerator ([ string prng = 'SIMPLE' ])
 *   number    rand.simple ( void )
 *   number    rand.arc4 ( void )
 *   string    rand.arc4.seed ([ string seed ])
 *   void      rand.shuffle ( array arr[, string prng = 'SIMPLE' ])
 */
	
/**
 * Wrapper for Math.random
 */
module.exports.simple = function() {
	return Math.random();
};

/**
 * Fetch a given PRNG function
 *
 * @access  public
 * @param   string    generator
 * @return  function
 */
module.exports.getGenerator = function(gen) {
	gen = gen || 'SIMPLE';
	switch (gen) {
		case 'ARC4':
			return module.exports.arc4;
		break;
		case 'SIMPLE':
			return module.exports.simple;
		break;
		default:
			throw 'Unknown value given for PRNG';
		break;
	}
};

/**
 * Generate a random double using the given algorithm
 *
 * @access  public
 * @param   string    generator
 * @return  number
 */
module.exports.double = function(gen) {
	return module.exports.getGenerator(gen || 'SIMPLE')();
};

/**
 * Generate a random integer between min and max using the given generator
 *
 * @access  public
 * @param   object    options { min, max, gen }
 * @return  number
 */
module.exports.int = function(opts) {
	var ret;
	opts.min = (opts.min === void(0)) ? 0 : opts.min;
	opts.max = (opts.max === void(0)) ? 32000 : opts.max;
	if (! opts.min && ! opts.max) {
		return 0;
	}
	ret = Math.floor(module.exports.double(opts.gen) * (opts.max + opts.min) + 1) - opts.min;
	if (ret === opts.max) {
		ret--;
	}
	return ret;
};

/**
 * Shuffle an array in place using the fisher-yates algorithm
 *
 * @access  public
 * @param   array     the array to shuffle
 * @param   string    optionally, the PRNG to use
 * @return  void
 * @link    http://en.wikipedia.org/wiki/Fisher-Yates_shuffle
 */
module.exports.shuffle = (function() {
	function Generator(gen) {
		return function(max) {
			return module.exports.int({
				min: 0, max: max, gen: gen
			});
		}
	}
	return function (arr, prng) {
		var randInt = Generator(prng), tmp;
		for (var i = arr.length - 1, j; i > 0; --i) {
			j = randInt(i);
			tmp = arr[i];
			arr[i] = arr[j];
			arr[j] = tmp;
		}
	}
}());

/**
 * ARC4 random double generator
 *
 * @function  number  module.exports.arc4 ( void )
 * @function  void    module.exports.arc4.seed ([ string seed[, boolean use_entropy ]])
 * 
 * This ARC4 implementation is borrowed from http://davidbau.com/encode/seedrandom.js
 * with modifications for this module.
 */
module.exports.arc4 = (function (pool, math, width, chunks, significance, overflow, startdenom) {
	// LICENSE (BSD):
	//
	// Copyright 2010 David Bau, all rights reserved.
	//
	// Redistribution and use in source and binary forms, with or without
	// modification, are permitted provided that the following conditions are met:
	// 
	//   1. Redistributions of source code must retain the above copyright
	//      notice, this list of conditions and the following disclaimer.
	//
	//   2. Redistributions in binary form must reproduce the above copyright
	//      notice, this list of conditions and the following disclaimer in the
	//      documentation and/or other materials provided with the distribution.
	// 
	//   3. Neither the name of this module nor the names of its contributors may
	//      be used to endorse or promote products derived from this software
	//      without specific prior written permission.
	// 
	// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	var ret = function() {
		return random();
	};
	var random = function() {
		throw 'You must seed the ARC4 generator before using it';
	};
	ret['seed'] = function seedrandom(seed, use_entropy) {
		var key = [];
		var arc4;
		seed = mixkey(flatten(
			use_entropy ? [seed, pool] :
			arguments.length ? seed :
			[new Date().getTime(), pool, window], 3), key);
		arc4 = new ARC4(key);
		mixkey(arc4.S, pool);

		random = function() {
			var n = arc4.g(chunks);
			var d = startdenom;
			var x = 0;
			while (n < significance) {
				n = (n + x) * width;
				d *= width;
				x = arc4.g(1);
			}
			while (n >= overflow) {
				n /= 2;
				d /= 2;
				x >>>= 1;
			}
			return (n + x) / d;
		};
		return seed;
	};

	function ARC4(key) {
		var t, u, me = this, keylen = key.length;
		var i = 0, j = me.i = me.j = me.m = 0;
		me.S = [];
		me.c = [];
		if (!keylen) { key = [keylen++]; }
		while (i < width) { me.S[i] = i++; }
		for (i = 0; i < width; i++) {
			t = me.S[i];
			j = lowbits(j + t + key[i % keylen]);
			u = me.S[j];
			me.S[i] = u;
			me.S[j] = t;
		}
		me.g = function getnext(count) {
			var s = me.S;
			var i = lowbits(me.i + 1); var t = s[i];
			var j = lowbits(me.j + t); var u = s[j];
			s[i] = u;
			s[j] = t;
			var r = s[lowbits(t + u)];
			while (--count) {
				i = lowbits(i + 1); t = s[i];
				j = lowbits(j + t); u = s[j];
				s[i] = u;
				s[j] = t;
				r = r * width + s[lowbits(t + u)];
			}
			me.i = i;
			me.j = j;
			return r;
		};
		me.g(width);
	}

	function flatten(obj, depth, result, prop, typ) {
		result = [];
		typ = typeof(obj);
		if (depth && typ == 'object') {
		for (prop in obj) {
			if (prop.indexOf('S') < 5) {
				try {
					result.push(flatten(obj[prop], depth - 1));
				} catch (e) { }
			}
		}
		}
		return (result.length ? result : obj + (typ != 'string' ? '\0' : ''));
	}

	function mixkey(seed, key, smear, j) {
		seed += '';
		smear = 0;
		for (j = 0; j < seed.length; j++) {
		key[lowbits(j)] =
			lowbits((smear ^= key[lowbits(j)] * 19) + seed.charCodeAt(j));
		}
		seed = '';
		for (j in key) { seed += String.fromCharCode(key[j]); }
		return seed;
	}

	function lowbits(n) { return n & (width - 1); }

	startdenom = math.pow(width, chunks);
	significance = math.pow(2, significance);
	overflow = significance * 2;

	mixkey(math.random(), pool);
	
	return ret;

// End anonymous scope, and pass initial values.
})(
	[],   // pool: entropy pool starts empty
	Math, // math: package containing random, pow, and seedrandom
	256,  // width: each RC4 output is 0 <= x < 256
	6,    // chunks: at least six RC4 outputs for each double
	52    // significance: there are 52 significant digits in a double
);

/* End of file rand.js */

},{}]},{},[1]);
