var board = [];
var rows;
var columns;

var minesCount = 10;
var minesLocation = []; // "2-2", "3-4", "2-1"

var tilesClicked = 0; //goal to click all tiles except the ones containing mines
var flagEnabled = false;

var difSelected = false;
var gameOver = false;

var difmode;

var lost;

var stopperStartStop = false;

window.onload = function() {
    //Stopper Elements
    var appendSeconds = document.getElementById("seconds")
    var appendMinutes = document.getElementById("minutes")
    document.getElementById("easyBut").addEventListener("click", easyDif);
    document.getElementById("mediumBut").addEventListener("click", mediumDif);
    document.getElementById("hardBut").addEventListener("click", hardDif);
    document.getElementById("easyBut").addEventListener("click", startClock);
    document.getElementById("mediumBut").addEventListener("click", startClock);
    document.getElementById("hardBut").addEventListener("click", startClock);

    //Saved username
    document.getElementById("username").innerText = localStorage.getItem("stored_username");
    //Reset button
    let reset = document.getElementById("reset");
    reset.onclick = function() {
    location.reload();
    }

    //Result table elements
    document.getElementById("result_table").style.display = "none";
    document.getElementById("ok").addEventListener("click", function () {
        $("#result_table").fadeOut(1000);
       
    });
    function revealTable() {
        if (lost) {
            document.getElementById("win_or_lose").style.color = "red";
            document.getElementById("win_or_lose").innerText = "LOST";
        }
        else
        {
            document.getElementById("win_or_lose").style.color = "green";
            document.getElementById("win_or_lose").innerText = "WON";
        }
        document.getElementById("mode").innerText = difmode;
        document.getElementById("current_minutes").innerText = minutes;
        document.getElementById("current_seconds").innerText = seconds;
        document.getElementById("current_tens").innerText = tens;
        $("#result_table").fadeIn(1000);

        //Updating the record table on the last game IF YOU WIN

        if (!lost) {
            //Username
        localStorage.setItem("last_username", localStorage.getItem("stored_username"));
            //Time
        var time_added = minutes +":"+seconds+":"+tens
        localStorage.setItem("last_time", time_added);
            //Difficulty
        localStorage.setItem("last_mode", difmode);
            //Date
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        localStorage.setItem("last_date", dateTime);
        }
        
        //Updating the record table on the best game
            //Casting the stored (string type) time to integer
        best_time_minutes = parseInt(localStorage.getItem("best_time_minutes"));
        best_time_seconds = parseInt(localStorage.getItem("best_time_seconds"));
        best_time_tens = parseInt(localStorage.getItem("best_time_tens"));
            //Funcion to update the best game IF YOU WIN
        function Update_best() {
            localStorage.setItem("best_username", localStorage.getItem("stored_username"));
            localStorage.setItem("best_time_minutes", minutes);
            localStorage.setItem("best_time_seconds", seconds);
            localStorage.setItem("best_time_tens", tens);
            localStorage.setItem("best_mode", difmode);
            best_time_added = localStorage.getItem("best_time_minutes")+":"+localStorage.getItem("best_time_seconds")+":"+localStorage.getItem("best_time_tens");
            localStorage.setItem("best_time", best_time_added);
            localStorage.setItem("best_date", dateTime);
        }
        //Checking if lost and if not then checking if the last is better than the current best and if yes update
        if(!lost)
        {
            if (minutes == best_time_minutes && seconds == best_time_seconds && tens == best_time_tens) {
                Update_best();
            }
            if (minutes == best_time_minutes && seconds == best_time_seconds && tens < best_time_tens) {
                Update_best();
            }
            if (minutes == best_time_minutes && seconds < best_time_seconds) {
                Update_best();
            }
            if (minutes < best_time_minutes) {
                Update_best();
            }
        }
        
        Update_record_table();
    }

    //Stopper
    var minutes = 00;
    var seconds = 00;
    var tens = 00;
    var appendMinutes = document.getElementById("minutes");
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
            if (seconds > 59) {
                //console.log("minutes");
                minutes++;
                appendMinutes.innerHTML = "0" + minutes;
                seconds = 0;
                appendSeconds.innerHTML = "0" + 0;
            }
            if (minutes > 9){
                appendMinutes.innerHTML = minutes;
            }
        } else {
            clearInterval(Interval);
        }
    }

    //Record table elements
    function Update_record_table() {
        //Best game
    document.getElementById("best_username").innerText = localStorage.getItem("best_username");
    document.getElementById("best_time").innerText = localStorage.getItem("best_time");
    document.getElementById("best_difmode").innerText = localStorage.getItem("best_mode");
    document.getElementById("best_date").innerText = localStorage.getItem("best_date");
        //Last game
    document.getElementById("last_username").innerText = localStorage.getItem("last_username");
    document.getElementById("last_time").innerText = localStorage.getItem("last_time");
    document.getElementById("last_difmode").innerText = localStorage.getItem("last_mode");
    document.getElementById("last_date").innerText = localStorage.getItem("last_date");
    }
    Update_record_table();

    function Delete_record_table() {
        //Best game data
    
    localStorage.setItem("best_username", "Nan");
    localStorage.setItem("best_time_minutes", "15");
    localStorage.setItem("best_time_seconds", "0");
    localStorage.setItem("best_time_tens", "0");
    best_time_added = localStorage.getItem("best_time_minutes")+":"+localStorage.getItem("best_time_seconds")+":"+localStorage.getItem("best_time_tens");
    localStorage.setItem("best_time", best_time_added);
    localStorage.setItem("best_date", "Nan");
    
        //Last game data
    localStorage.setItem("last_username", "Nan");
    localStorage.setItem("last_time", "Nan");
    localStorage.setItem("last_date", "Nan");
    Update_record_table();
    }
    document.getElementById("delete").addEventListener("click", Delete_record_table);




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

    //Defineing the difficulties
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
            difmode = "Easy";
            startGame();
        }
    }
    function mediumDif() {
        if (!difSelected){
            difSelect();
            rows = 14;
            columns = 14;
            minesCount = 30;
            clearBoard();
            document.getElementById("board").style.height = "728px";
            document.getElementById("board").style.width = "728px";
            difmode = "Medium";
            startGame();
        }
    }
    function hardDif() {
        if (!difSelected){
            difSelect();
            rows = 20;
            columns = 20;
            minesCount = 40;
            clearBoard();
            document.getElementById("board").style.height = "1040px";
            document.getElementById("board").style.width = "1040px";
            difmode = "Hard";
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
            lost = true;
            revealMines();
            window.setTimeout(revealTable, 1000);
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
            lost = false;
            window.setTimeout(revealTable, 1000);
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
}