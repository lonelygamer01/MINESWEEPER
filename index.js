window.onload = function () {
    let log_site = document.getElementById("log");
    let log_in_button = document.getElementById("log-in");
    let username_log = document.getElementById("username_log");

    t = 6;    
    function Counter() {
        if (t > 0) {
            t -= 1; 
            document.getElementById("counter").innerText = t;
        }
    }

    log_in_button.onclick = function() {
            let username = document.getElementById("username_log").value.replaceAll(" ","");
            if (username != "") {
                localStorage.setItem("stored_username", username);
                document.getElementById("result").innerText = "Log-in was successful, redirecting to the game right in: ";
                setInterval(Counter, 1000);
                function igen()
                {
                    window.open("minesweeper.html", "_self");
                }
                setTimeout(igen, 7000);
            }
            else
            {
                document.getElementById("result").innerText = "Log-in was not successful, the username doesn't match the requirements!\nTry again!";
            }
        
    }
}





