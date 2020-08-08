// Save this along with the network later. It should not be hard coded .,.
var categories = [
  "moon",
  "rain",
  "flower",
  "mountain",
  "star",
  "cloud",
  "sun",
  "tree"
];

var canvas = document.getElementById("canvas");
var canvasLeft, canvasTop, context, lastX = 0, currentX = 0,
lastY = 0, currentY = 0, clicked = false;
var canvasFixedWidth = 300;
var canvasFixedHeight = 200;

var MARKER_STATUS_MARKER = 0;
var MARKER_STATUS_ERASER = 1;
var markerStatus;
updateMarker(MARKER_STATUS_MARKER);

// Adjusts the positions and contents of all panels.
initializePanels();

// List the names of the categories in the draw prompt panel.
var categoriesList = document.getElementById("categoriesList");
categories.forEach(function(category){
	var item = document.createElement("li");
	item.appendChild(document.createTextNode(category));
	categoriesList.appendChild(item);
});

// Is called when window is resized. Contents need to be re-adjusted to fit the new window.
function onResizeEvent(){
	initializePanels();
}

function initializePanels(){
	var marginLeft = 0.5;
	var marginTop = 1;

	// Initialize panels.
	initializePanel("drawPromptPanel", 0, 0, 15, 70, marginLeft, marginTop, false, false, "rgb(237, 217, 119)", 16);
	initializePanel("aboutUsPanel", 15, 0, 85, 10, marginLeft, marginTop, true, false, "rgb(237, 217, 119)", 16);
	initializePanel("toolsPanel", 94, 10, 6, 90, marginLeft, marginTop, true, true, "rgb(237, 217, 119)", 16);
	initializePanel("canvasPanel", 15, 10, 79, 90, marginLeft, marginTop, true, true, "lightblue", 16);
	initializePanel("predictionsPanel", 0, 70, 15, 30, marginLeft, marginTop, false, true, "rgb(237, 217, 119)", 16);

	// Further initialize the predictions panel.
	initializePredictionsTextbox();

	// Further initialize the canvas panel.
	initializeCanvas();
}

function initializePanel(id, left, top, absoluteWidth, absoluteHeight, marginLeft, marginTop, removeLeftMargin, removeTopMargin, backgroundColor, borderRadius){
	var element = document.getElementById(id);
	var style = element.style;

	if(removeLeftMargin){
		left -= marginLeft;
		absoluteWidth += marginLeft;
	}

	if(removeTopMargin){
		top -= marginTop;
		absoluteHeight += marginTop;
	}

	var width = absoluteWidth - 2 * marginLeft;
	var height = absoluteHeight - 2 * marginTop;

	style.position = "absolute";
	style.left = left + marginLeft + "%";
	style.top = top + marginTop + "%";

	style.padding = "0%";
	style.margin = "0%";

	style.width = width + "%";
	style.height = height + "%";

	style.backgroundColor = backgroundColor;
	style.borderRadius = borderRadius + "px";

	// The content of the panel will all be placed inside the following div.
	var div = document.getElementById(id + "Content");

	var divMargin;
	if(width > height)
		divMargin = screen.height * height / 100 / 10;
	else
		divMargin = screen.width * width / 100 / 20;

	var parentWidth = element.getBoundingClientRect().right - element.getBoundingClientRect().left;
	var parentHeight = element.getBoundingClientRect().bottom - element.getBoundingClientRect().top;
	div.style.height = parentHeight - divMargin * 2 + "px";
	if(id == "canvasPanel")
		div.style.width = div.style.height;
	else
		div.style.width = parentWidth - divMargin * 2 + "px";

	div.style.margin = divMargin + "px";

	// Uncomment the next line to see the boundaries of the div.
	//div.style.backgroundColor = "magenta";
}

function initializePredictionsTextbox(){
	var textbox = document.getElementById("predictionsTextbox");
	textbox.style.width = "100%";
	textbox.style.height = "100%";
	textbox.style.resize = "none";
	textbox.style.padding = "0px";
	textbox.style.background = "transparent";
	textbox.style.border = "none";
	textbox.style.outline = "none";
}

function initializeCanvas(){
	canvas.style.width = "100%";
	canvas.style.height = "100%";
	canvas.style.backgroundColor = "white";

	canvasLeft = canvas.offsetLeft + document.getElementById("canvasPanel").offsetLeft;
	canvasTop = canvas.offsetTop + document.getElementById("canvasPanel").offsetTop;

  canvas.addEventListener("mousemove", function (e) {
            draw_or_erase('move', e)
        }, false);
  canvas.addEventListener("mousedown", function (e) {
            draw_or_erase('down', e)
        }, false);
  canvas.addEventListener("mouseup", function (e) {
            draw_or_erase('up', e)
        }, false);


	// Set the bounds of the drawing canvas.
	canvas.width = canvas.getBoundingClientRect().right - canvas.getBoundingClientRect().left;
	canvas.height = canvas.getBoundingClientRect().bottom - canvas.getBoundingClientRect().top;
  context = canvas.getContext("2d");
  ww = canvas.width
  hh = canvas.height
  canvas.width = canvasFixedWidth;
  canvas.height = canvasFixedHeight;

	// Draw the   : (   emoji...
	// context.beginPath();
	// context.arc(canvas.width / 2, canvas.height / 2, 270, 0, 2 * Math.PI);
	// context.stroke();
  //
	// context.beginPath();
	// context.arc(canvas.width / 2 - 100, canvas.height / 2 - 100, 40, 0, 2 * Math.PI);
	// context.stroke();
  //
	// context.beginPath();
	// context.arc(canvas.width / 2 + 100, canvas.height / 2 - 100, 40, 0, 2 * Math.PI);
	// context.stroke();
  //
	// context.beginPath();
	// context.arc(canvas.width / 2, canvas.height / 2 + 200, 80, -Math.PI * 3 / 4, -Math.PI * 1 / 4);
	// context.stroke();
}

function newPrediction(category){
	var textbox = document.getElementById("predictionsTextbox");
	if(category[0] == 'a' || category[0] == 'e' || category[0] == 'i' || category[0] == 'o' || category[0] == 'u')
		textbox.innerHTML += "Is it an " + category + "?\n";
	else
		textbox.innerHTML += "Is it a " + category + "?\n";
	textbox.background = "none";
	textbox.scrollTop = textbox.scrollHeight;
}

function updateMarker(status){
	markerStatus = status;

	switch(markerStatus){
		case MARKER_STATUS_MARKER:
			canvas.style.cursor = "url('Assets/Images/Cursors/cursor_marker.png') 0 32, auto";
			break;

		case MARKER_STATUS_ERASER:
			canvas.style.cursor = "url('Assets/Images/Cursors/cursor_eraser.png') 12 32, auto";
			break;
	}
}

function clearCanvas(){
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function draw_or_erase(mouse, e){
  switch(markerStatus){
		case MARKER_STATUS_MARKER:
			find_place(mouse, e, true);
			break;
		case MARKER_STATUS_ERASER:
			find_place(mouse, e, false)
			break;
	}

}

function draw(black) {
     context.beginPath();
     context.moveTo(lastX, lastY);
     context.lineTo(currentX, currentY);
     if (black){
       context.strokeStyle = "black";
       context.lineWidth = 1.5;
     }
     else{
       context.strokeStyle = "white";
       context.lineWidth = 9;
     }
     context.stroke();
 }

function find_place(mouse, e, is_marker) {
    if (mouse == 'up') {
      clicked = false;
    }
    if (mouse == 'down') {
        clicked = true;
        lastX = currentX;
        lastY = currentY;
        currentX = (e.pageX - canvasLeft) * canvasFixedWidth/ ww;
        currentY = (e.pageY - canvasTop) * canvasFixedHeight/ hh;
    }
    if (mouse == 'move' && clicked) {
            lastX = currentX;
            lastY = currentY;
            currentX = (e.pageX - canvasLeft) * canvasFixedWidth/ ww;
            currentY = (e.pageY - canvasTop) * canvasFixedHeight/ hh;
            if (is_marker){
                draw(true);
            }
            else{
               draw(false);
            }
    }
}

function showCompressedImage(){
	socket.send("displayImage");
}

const socket = new WebSocket('ws://localhost:31800');

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

socket.addEventListener('message', function (event) {
	newPrediction(event.data);
});

function isOpen(ws) { return socket.readyState === socket.OPEN }

function fetchData() {
    var dataImg = context.getImageData(0, 0, 300, 200);
    if (!isOpen(socket)) return;
	socket.send(dataImg.data);
}

setInterval(fetchData, 3000);
