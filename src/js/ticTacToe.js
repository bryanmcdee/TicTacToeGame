(function(){        
    var currentPlayer;
    var nextPlayer;

    function Player(id, number, name, boardSymbol, gameBoard) {
        this.id = id;
        this.number = number;
        this.name = name;
        this.boardSymbol = boardSymbol;
        this.gameBoard = gameBoard;
    }    

    var game = (function() {
        var masterGameBoard;

        var getNewPlayerGameBoard = function() {
            return [0 ,0 ,0, 0, 0, 0, 0, 0, 0];
        }; 
    
        var getNumberOfTurnsTaken = function() {
            function getSum(total, num) {
                return total + num;
            }
            return masterGameBoard[0].gameBoard.reduce(getSum) + masterGameBoard[1].gameBoard.reduce(getSum);
        };

        var tileHasAlreadyBeenSelected = function(tileId) {
            return game.getBoard()[0].gameBoard[tileId] === 1 || game.getBoard()[1].gameBoard[tileId];
        };

        var getMasterGameBoard = function() {
            if (masterGameBoard === 'undefined') {
                initializeNewGame();
            }
            return masterGameBoard;
        };

        var initializeNewGame = function() {
            var player1 = new Player(0, 1, 'Player 1', 'X', getNewPlayerGameBoard());
            var player2 = new Player(1, 2, 'Player 2', '0', getNewPlayerGameBoard()); 
            masterGameBoard = [player1, player2];
        };      
        
        return {
            initialize: initializeNewGame,
            getNumberOfTurnsTaken: getNumberOfTurnsTaken,
            tileHasAlreadyBeenSelected: tileHasAlreadyBeenSelected,
            getBoard: getMasterGameBoard
        };
    }());

    var playerWon = function(playersBoard){
        var winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (var i = 0; i < winningCombinations.length; i++) {
            var combination = winningCombinations[i];
            var score = playersBoard[combination[0]] + playersBoard[combination[1]] + playersBoard[combination[2]];
            if (score === 3) {
                return true;
            }
        }
    }; 

    var ui = (function() {
        var isEven = function(number) {
            return number%2; 
        };

        var setCurrentPlayerContainerTitle = function(displayText) {
            $('#currentPlayer').text(displayText);
        };

        var setTileClass = function(self) {
            var numberOfTurns = game.getNumberOfTurnsTaken();  

            if (isEven(numberOfTurns)) {
                currentPlayer = 0;
                nextPlayer = 1;
                self.addClass('selectedTilePlayer1');
            } else {
                currentPlayer = 1;
                nextPlayer = 2;
                self.addClass('selectedTilePlayer2');
            }  
        };

        var setTileText = function(self) {
            self.text(game.getBoard()[currentPlayer].boardSymbol);
        };

        var initialize = function() {
            var $tiles = $('.tile');
            $tiles.removeClass('selectedTilePlayer1 selectedTilePlayer2');
            $tiles.text('');
            setCurrentPlayerContainerTitle("Player 1's Turn");
        };

        var setSelectedTile = function(self) {
            setTileClass(self);
            setTileText(self);            
        };

        return {
            setCurrentPlayerContainerTitle: setCurrentPlayerContainerTitle,
            setSelectedTile: setSelectedTile,
            initialize: initialize
        };
    }());
    
    var bindResetButtonClickEvent = function() {
        $('#resetGame').click(function(){
            var resetGame = window.confirm('Are you sure you want to reset the game?');
            if (resetGame) {
                ui.initialize();
                game.initialize(); 
                bindTileClickEvent();               
            }
        });
    };

    var bindTileClickEvent = function() {
        $('.tile').click(function(event) {
            var self = $(this);
            self.off('click');
            var tileId = event.target.id;
            
            if (game.tileHasAlreadyBeenSelected(tileId)){
                //alert('This tile has already been selected. Please select another one.')                
            } else {
                ui.setSelectedTile(self);
                game.getBoard()[currentPlayer].gameBoard[tileId] = 1;   
                var isWinner = playerWon(game.getBoard()[currentPlayer].gameBoard); 
                if (isWinner) {
                    setTimeout(function(){
                        $('.tile').off('click');
                        var winningPlayerText = 'Player ' + currentPlayer + ' won!!';
                        ui.setCurrentPlayerContainerTitle(winningPlayerText);
                        var resetGame = window.confirm(winningPlayerText + ' Do you want to play again?');
                        if (resetGame) {
                            ui.initialize();
                            game.initialize(); 
                            bindTileClickEvent();               
                        }
                    }, 150);                    
                } else {
                    ui.setCurrentPlayerContainerTitle("Player " + nextPlayer + "'s Turn");
                }
            }     
        });
    };
    
    var setClickEvents = (function() {
        bindResetButtonClickEvent(); 
        bindTileClickEvent();        
    }());    

    var initializeNewGame = (function(){
        game.initialize();
        ui.initialize();        
    }());
}());