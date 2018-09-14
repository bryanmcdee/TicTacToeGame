(function(){
    var welcomeText = document.getElementById('welcome-text');
    welcomeText.innerHTML = '';
    var introduction = 'Hello. ';
    var question = 'Would you like to play a game?';

    function printTextOnScreen(str, index) {
        var typeTimer = setInterval(function() {
            index = index + 1;
            welcomeText.innerHTML = "> " + str.slice(0, index);
            if (index === str.length) {
                clearInterval(typeTimer);                
            }
        }, 75);
    }
      
    function displayButtons() {
        $("#acceptGameInvitation").fadeIn("slow");
    }

    setTimeout(printTextOnScreen, 2000, introduction, 0);
    setTimeout(printTextOnScreen, 4000, introduction + question, introduction.length, displayButtons);
    setTimeout(displayButtons, 6500);
}());