var board = [];
var rows = 10;
var columns = 10;

var minesCount = 10;
var minesLocation = []; // "2-2", "3-4", "2-1"

var tilesClicked = 0; //goal to click all tiles except the ones containing mines
var flagEnabled = false;

var difSelected = false;
var gameOver = false;

var stopperStartStop = false;

window.onload = function() {
    var appendTens = document.getElementById("tens")
    var appendSeconds = document.getElementById("seconds")
    document.getElementById("easyBut").addEventListener("click", easyDif);
    document.getElementById("mediumBut").addEventListener("click", mediumDif);
    document.getElementById("hardBut").addEventListener("click", hardDif);
    document.getElementById("easyBut").addEventListener("click", startClock);
    document.getElementById("mediumBut").addEventListener("click", startClock);
    document.getElementById("hardBut").addEventListener("click", startClock);
    document.getElementById("username").innerText = localStorage.getItem("stored_username");
    let reset = document.getElementById("reset");
    reset.onclick = function() {
    location.reload();
    }

    //Stopper
    var seconds = 00;
    var tens = 00;
    var appendTens = document.getElementById("tens")
    var appendSeconds = document.getElementById("seconds")
    var Interval ;
    function startClock(){
        clearInterval(Interval);
        Interval = setInterval(startTimer, 10);
    }
    function startTimer () {
        if(!gameOver){
            tens++; 

            if(tens <= 9){
            appendTens.innerHTML = "0" + tens;
            }

            if (tens > 9){
            appendTens.innerHTML = tens;
            } 
            
            if (tens > 99) {
            //console.log("seconds");
            seconds++;
            appendSeconds.innerHTML = "0" + seconds;
            tens = 0;
            appendTens.innerHTML = "0" + 0;
            }
            
            if (seconds > 9){
            appendSeconds.innerHTML = seconds;
            }
        } else {
            clearInterval(Interval);
        }
    }
}
function clearBoard(){
    const list = document.getElementById("board");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
}

function difSelect(){
    difSelected = true;
    document.getElementById("easyBut").style.color = "grey";
    document.getElementById("mediumBut").style.color = "grey";
    document.getElementById("hardBut").style.color = "grey";
}

function easyDif() {
    if (!difSelected){
        difSelect();
        rows = 8;
        columns = 8;
        minesCount = 10;
        clearBoard();
        document.getElementById("board").style.height = "416px";
        document.getElementById("board").style.width = "416px";
        difSelect();
        startGame();
    }
}
function mediumDif() {
    if (!difSelected){
        difSelect();
        rows = 14;
        columns = 14;
        minesCount = 40;
        clearBoard();
        document.getElementById("board").style.height = "728px";
        document.getElementById("board").style.width = "728px";
        startGame();
    }
}
function hardDif() {
    if (!difSelected){
        difSelect();
        rows = 14;
        columns = 20;
        minesCount = 60;
        clearBoard();
        document.getElementById("board").style.height = "728px";
        document.getElementById("board").style.width = "1040px";
        startGame();
    }
}


function setMines() {
    // minesLocation.push("2-2");
    // minesLocation.push("2-3");
    // minesLocation.push("5-6");
    // minesLocation.push("3-4");
    // minesLocation.push("1-1");

    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}


function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    document.getElementById("board").addEventListener("contextmenu", (e) => {
        setFlag();
        e.preventDefault();
    });
    setMines();

    //populate our board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }
    
    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }
    if (tile.innerText == "🚩"){
        return;
    }

    if (minesLocation.includes(tile.id)) {
        // alert("GAME OVER");
        gameOver = true;
        revealMines();
        return;
    }


    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);

}

function revealMines() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    //top 3
    minesFound += checkTile(r-1, c-1);      //top left
    minesFound += checkTile(r-1, c);        //top 
    minesFound += checkTile(r-1, c+1);      //top right

    //left and right
    minesFound += checkTile(r, c-1);        //left
    minesFound += checkTile(r, c+1);        //right

    //bottom 3
    minesFound += checkTile(r+1, c-1);      //bottom left
    minesFound += checkTile(r+1, c);        //bottom 
    minesFound += checkTile(r+1, c+1);      //bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        //top 3
        checkMine(r-1, c-1);    //top left
        checkMine(r-1, c);      //top
        checkMine(r-1, c+1);    //top right

        //left and right
        checkMine(r, c-1);      //left
        checkMine(r, c+1);      //right

        //bottom 3
        checkMine(r+1, c-1);    //bottom left
        checkMine(r+1, c);      //bottom
        checkMine(r+1, c+1);    //bottom right
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }

}


function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}