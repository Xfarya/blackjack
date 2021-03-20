// need to refresh game deck;

// ON LOAD:
// Hit/Stand disabled until first cards dealt;
$(".hit, .stand").prop("disabled", true);
// startgame is to deal the cards;

// BUTTON : DEAL - i.e. startgame;
$(".startgame").click(function() {
  // activate hit and stand buttons;
  $(".hit, .stand").prop("disabled", false);
  // Refresh message:
  $(".message").html("Time to play!");
  // Deal button is still active; (?)
  $(".startgame").prop("disabled", true);
  $(".startgame").html("Deal");
  // shuffle deck function (Dursten algorithm);
  shuffleDeck(cards);
  // Deal cards - a) create deck and b) push cards;
  dealCards();
  // refresh score tally to 0;
  $(".playerscore").html("0");
  $(".dealerscore").html("0");
  let playerScore = 0;
});

// BUTTON - HIT;
$(".hit").click(function() {
  // hit will activate function to add another card to players hand;
  playerHit();
});

// BUTTON - STAND
$(".stand").click(function() {
  // disable any further game-play;
  $(".hit").prop("disabled", true);
  $(".stand").prop("disabled", true);
  // activate endgame function:
  endGame();
});

// score calculator for later;
function blackJack(arr) {
  let total = 0;
  for (var l = 0; l < arr.length; l++) {
    total += arr[l].value;
    if (arr[l].value == '1' && total > 21) {
      total -= 10;
    }
  }
  for (var m = 0; m < arr.length; m++) {
    if (arr[m].value == '1' && total <= 11) {
      total += 10
    }
    // loop again;
  }

  return total;
}

// shuffle cards:
function shuffleDeck(arr) {
  for (var k = arr.length - 1; k > 0; k--) {
    var j = Math.floor(Math.random() * (k + 1));
    var temp = arr[k];
    arr[k] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// deal cards:

// a) create deck;
let cards = [];
var dealingtable = document.getElementById("dealingtable");
let suits = ['spades', 'hearts', 'clubs', 'diamonds'];
let numbers = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

for (s in suits) {
  let suitColor = (suits[s] == 'spades' || suits[s] == 'clubs') ? "black" : "red";
  for (num in numbers) {
    let cardValue = (num > 9) ? 10 : parseInt(num) + 1;
    let cardObj = {
      suits: suits[s],
      numbers: numbers[num],
      value: cardValue,
      color: suitColor,
    }
    cards.push(cardObj);
  }
}


// b) push card and cover;

function pushCard(c, i) {
  // var randomNum = Math.floor(Math.random()*52);
  // return " <span style='color: " + cards[counter].color +
  //   "'>" + cards[counter].numbers + "&" + cards[counter].suits + ";"  + "</span>";
  // i is from the loop in dealCards();
  let cardPosition = (i > 0) ? i * 38 + 100 : 100;
  return "<div class='card " + cards[c].suits +
    "' style='left:" + cardPosition + "px'><div class='top-card suit'>" + cards[c].numbers + "<br></div><div class ='middle-card suit'></div><div class ='bottom-card suit'>" + cards[c].numbers + "<br></div></div>";
};

function pushCover(c, i) {
  // let cardPosition = (i>0) ? i*38+100 : 100;
  return "<div class='cover' style='left:100px'></div>";
}

// empty array for card values from object;
let playerCards = [];
let dealerCards = [];

// counter to tally cards and reshuffle;
let cardCounter = 0;

function reshuffle() {
  // console.log(cards);
  cardCounter++
  if (cardCounter > 40) {
    shuffleDeck(cards);
    cardCounter = 0;
  }
}

// empty variables for pushing corresponding css to html;
let playersCards = $("#playersCards")[0];
let dealersCards = $("#dealersCards")[0];


function dealCards() {
  // make sure arrays are refreshed (and = 0) before you begin dealing!
  playerCards = [];
  dealerCards = [];
  playersCards.innerHTML = "";
  dealersCards.innerHTML = "";
  // baby-loop for 2 cards;
  for (var i = 0; i < 2; i++) {
    dealerCards.push(cards[cardCounter]);
    dealersCards.innerHTML += pushCard(cardCounter, i);
    // $("#dealersCards")[0].html(pushCard);
    reshuffle();
    // first dealer card, push a cover onto it!
    if (i === 0) {
      dealersCards.innerHTML += pushCover(cardCounter, i);
    };
    playerCards.push(cards[cardCounter]);
    playersCards.innerHTML += pushCard(cardCounter, i);
    reshuffle();
  }
  // console.log(dealersCards);
  // console.log(playersCards);
  if (!isNatural) {
    endgame();
  } else {
    isNatural();
  }
}

function isNatural() {
  playerScore = blackJack(playerCards)
  if (playerScore == 21 && playerCards.length === 2) {
    $(".message").html('<div class="message twentyone"><br>Congratulations!<br>You win!<br>You are a BlackJack natural!:)</div>');
    $(".startgame").prop("disabled", false);
    $(".startgame").html("Deal again");
    $(".playerscore").html(playerScore);
    $(".hit, .stand").prop("disabled", true);
  }
}

// when you HIT; another card will be added to player array;

function playerHit() {
  playerCards.push(cards[cardCounter]);
  playersCards.innerHTML += pushCard(cardCounter, playerCards.length - 1);
  cardCounter++;
  playerScore = blackJack(playerCards);
  $(".playerscore").html(playerScore);
  if (playerScore > 21) {
    $(".hit").prop("disabled", true);
    $(".stand").prop("disabled", true);
    endGame();
  }
}

// endgame is activated by going bust or clicking STAND:

function endGame() {
  // the player score;
  playerScore = blackJack(playerCards);
  // remove the cover;
  $(".cover").css("display", "none");
  // calculate dealer score using looop:
  let dealerScore = blackJack(dealerCards);
  while (dealerScore < 17) {
    dealerCards.push(cards[cardCounter]);
    dealersCards.innerHTML += pushCard(cardCounter, dealerCards.length - 1);
    reshuffle();
    dealerScore = blackJack(dealerCards);
  }
  // summing it up - print values to screen;
  $(".dealerscore").html(dealerScore);
  $(".playerscore").html(playerScore);
  // add conditionals for each possible condition;
  if (playerScore === 21 && dealerScore !== 21) {
    $(".message").html('<div class="message twentyone"><br>Congratulations!<br> You hit 21! <br>You win!</div>');
  } else if (playerScore === dealerScore &&
    playerScore <= 21 && dealerScore <= 21) {
    $(".message").html('<div class="resultsdraw"><br>draw!<br> play again</div>');
  } else if (playerScore > 21 && dealerScore > 21) {
    $(".message").html('<div class="resultslose"><br>bust!<br> you lose<div>');
  } else if (playerScore > 21 && dealerScore <= 21) {
    $(".message").html('<div class="resultslose"><br>bust! <br>dealer wins <div>')
  } else if (playerScore < dealerScore &&
    playerScore < 21 && dealerScore <= 21) {
    $(".message").html('<div class="resultslose"><br>dealer wins! <br>play again<div>');
  } else if (playerScore > dealerScore &&
    playerScore < 21 && dealerScore < 21) {
    $(".message").html('<div class="resultswin"><br>you win!<div>');
  } else if (playerScore < 21 && dealerScore > 21) {
    $(".message").html('<div class="resultswin"><br>dealer bust!<br> you win!<div>');
  }
  $(".startgame").prop("disabled", false);
  $(".startgame").html("Deal again");
}
