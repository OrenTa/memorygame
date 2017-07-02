// using the mustache library of html templating
// starting git also

const sets = 8;
var matrix = [];
var counter = 0;
var firstClicked = false;
var firstCard = null;
var i = 0;
const BACK_CARD = "images/back.jpg";

initMatrix();
initScreen();

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
			rendered = Mustache.render(imgtemplate, {imgsrc: "images/back.jpg", idxy:y+x*10});
			$temp = $(rendered)
			$temp.click( function(xcopy,ycopy,thiscopy) {
				return function() {
					click_handler(xcopy,ycopy)
				}
			}(x,y));
			$('#container #row:nth-child(' + (y+1) + ')').append($temp);
        }
    }

}

function click_handler(xx,yy) {
	//matrix_flip_card(xx,yy);
	//screen_update_card();
	temp_screen_show_card(xx,yy);
	//cardd.children[0].src="images/" + matrix[xx-1][yy-1].imgNum + ".jpg";
}

//view function
function temp_screen_show_card(x,y) {
	$('#' + (y+x*10) + ' img').attr('src', 'images/' + matrix[x][y].imgNum + '.jpg');	
	console.log(x+1);
}

function initMatrix() {
    // there are #sets sets of cards
    // I will create an array of 16 and ..
    // fill the array 
    // then use the array to fill the matrix
    // first create a sorted array then 
    // randomize an array

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