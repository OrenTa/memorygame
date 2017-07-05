// TODO:
// at the end of timer show overlay "end - click to try again" - like this https://www.w3schools.com/howto/howto_js_fullscreen_overlay.asp or probably better - this https://www.w3schools.com/howto/howto_css_overlay.asp
// then add animation flip
// add sound - https://www.w3schools.com/html/html5_audio.asp
// conside building a state machine control
// add general music and add success tone.
// finish the first game
// deploy
// kill Amazon lightsale and Amazon in general
// connect to something BIG like FB https://developers.facebook.com/docs/games

const sets = 8;
var matrix = [];
var score = 0;
var firstClicked = false;
var firstRevealed = [0,0];
var i = 0;
var allow_continue = true;
var counter = 60;
var cardsleft; //used to track how many cards left to solve all puzzle
const BACK_CARD = "images/back.jpg";

initMatrix();
initScreen();
//$("#card").flip();
cardsleft = sets * 2;

function initScreen() {
  
	var imgtemplate = $('#imgtemplate').html();
	var rowtemplate = $('#rowtemplate').html();
	var rendered = "";
	var temp;
	var x;
	var y;
	
  	Mustache.parse(imgtemplate);   // optional, speeds up future uses
	for (y = 0; y < (sets/2) ; y++) {
        rendered = Mustache.render(rowtemplate);
		$('#container').append(rendered);		
		rendered = Mustache.render(imgtemplate, {imgsrc: BACK_CARD });
		for (x = 0; x < (sets/2) ; x++) {
			rendered = Mustache.render(imgtemplate, {imgsrc: BACK_CARD, idxy:y+x*10});
			$temp = $(rendered)
			$temp.find("img").click( function(xcopy,ycopy) {
				return function() {
					click_handler(xcopy,ycopy)
				}
			}(x,y));
			$('#container #row:nth-child(' + (y+1) + ')').append($temp);
        }
    }
}

// used to remove click handler from revealed cards
function removeClickHandler (x,y) {
	$('#' + (y+x*10) + ' img').off();
}

// runs logic
// updates the matrix
// calls the screen/card updates
function click_handler(xx,yy) {
	var img;
	var xp,xy;
	var audio;
	
	audio = document.getElementById("clicksound");
	audio.play();
	
    if (firstClicked) {
        allow_continue = false;
        firstClicked = false;
		xp=firstRevealed[0];
		yp=firstRevealed[1];
        img = 'images/' + matrix[xx][yy].imgNum + '.jpg'
        screen_update_card(xx,yy,img);
        //check if found matching cards
        if (matrix[xx][yy].imgNum == matrix[xp][yp].imgNum) {
            matrix[xx][yy].faceUp = true;
            matrix[xp][yp].faceUp = true;
			removeClickHandler(xx,yy);
			removeClickHandler(xp,yp);
            firstRevealed = [0,0];
            allow_continue = true;
			score = score+10;
			cardsleft = cardsleft - 2;
			if (cardsleft ==0) {
				document.getElementById("overlay").style.display = "block";
				clearInterval(x);
			}
			// $('#score').text('SCORE:  ' + score); // score update if required.
        }
        else { // cards do not match - flip back
            setTimeout(function(){
                screen_update_card(xx,yy,BACK_CARD);
                screen_update_card(firstRevealed[0],firstRevealed[1],BACK_CARD);
                firstRevealed = [0,0];
                allow_continue = true;
            }, 1500);
        }
    }
    else { //if this is the first card clicked
        if (allow_continue) {
            firstClicked = true;
            firstRevealed = [xx,yy];
            img = 'images/' + matrix[xx][yy].imgNum + '.jpg'
            screen_update_card(xx,yy,img);
        }
    }
}

//view function
function screen_update_card(x,y,img) {
	$('#' + (y+x*10) + ' img').attr('src', img);
}

function initMatrix() {
    var cards = [];
    for (i = 0; i < sets; i++) {
        cards.push(i);
        cards.push(i);
    }
    
    shuffle(cards);

    // add cards to matrix using shuffeled set
    for (i = 0; i < (sets/2) ; i++) {
        matrix.push([]);
        for (y = 0; y < (sets/2) ; y++) {
            matrix[i].push({imgNum:cards.pop(), faceUp:false, selected:false});
        }
    }
}

var x = setInterval(function() {
	
	document.getElementById("counter").innerHTML = counter;
	counter = counter - 1;
	if (counter < 1) {
		clearInterval(x);
		document.getElementById("counter").innerHTML = "EXPIRED";
	}
}, 1000);


// helper functions
///////////////////////////////////////////////
///////////////////////////////////////////////


// converts an array to set of something ...
// taken from stack overflow
// here https://stackoverflow.com/questions/18673860/defining-a-html-template-to-append-using-jquery
function render(props) {
  return function(tok, i) { return (i % 2) ? props[tok] : tok; };
}

// shuffle function
// this function was taken from stackoverflow here 
// here https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}