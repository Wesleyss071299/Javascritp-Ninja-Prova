(function($) {

    "use-strict";

    var app = (function appController() {
        var $buttonsGame = $('[data-js="buttons-game"]').get();
        var $gameInfo = $('p[data-js="info"]').get();
        var $numbers = $('section[data-js="numbers"]').get();
        var allGames = []
        var currentGame = []
        var betNumbers = []
        return {
            init: function init() {
                this.gameInfo();
                this.initEvents();     
            },

            initEvents: function initEvents() {
                document.addEventListener('click',  function(e) {

                    var dataset = e.target.dataset
                   
                    if (dataset.gameType) 
                        return app.setGameType(dataset.gameType)
                    if (dataset.number)
                        return app.selectNumber(dataset.number)
                    if (dataset.button === 'clean-game')
                        return app.cleanGame()
                    if (dataset.button === 'random-game')
                        return app.completeGame()
                }, true)
            },
            completeGame: function completeGame(){
                var game = allGames.filter(function (game) {
                    return game.type === currentGame.type
                })[0]

                for (var i = 1; i <= game['max-number']; i++) {
                    var number = Math.ceil(Math.random() * game.range)
                    console.log('number antes' + number )
                    if (app.numberBetExist(betNumbers, number)) {
                        i--;
                        console.log('number ' + number )
                        console.log('i ' + i)
                    }
                    betNumbers.push(number)    
                }
                app.colorNumbers()

            },
            cleanGame: function cleanGame() {
                betNumbers = []
                var $buttonSelected = $('.game-number_selected').get()
                if ($buttonSelected) {
                  $buttonSelected.classList.remove('game-number_selected')
                  cleanGame()
                }
            },
            colorNumbers : function colorNumbers () {
                betNumbers.map(function (number) {
                  var element = $('div[data-number="' + number + '"]').get()
                  element.classList.add('game-number_selected')  
                })
            },
            removeNumber: function removeNumber(number){
                var item = $('div[data-number="' + number + '"]').get()
                item.classList.remove('game-number_selected')
            },
            numberBetExist: function numberBetExist(array, number){
                return array.some((item) => {
                    return item == number
                })
            },
            arrayRemove: function arrayRemove(arr, value) { 
                return arr.filter(function(ele){ 
                    return ele != value; 
                });
            },
            selectNumber : function selectNumber(currentNumber) {
                var game = allGames.filter( (item) => {
                    return item.type == currentGame.type
                })[0]

                if (app.numberBetExist(betNumbers, currentNumber)){
                    console.log('Item reperido')
                    betNumbers = app.arrayRemove(betNumbers, currentNumber)
                    console.log(betNumbers)
                    app.removeNumber(currentNumber)
                    return                      
                }

                if (game['max-number'] === betNumbers.length){
                    var last = betNumbers.slice(-1)[0]
                    betNumbers.pop();
                    betNumbers.push(currentNumber)
                    app.removeNumber(last)
                    app.colorNumbers()
                }
                
                
                if (game['max-number'] > betNumbers.length){
                    betNumbers.push(currentNumber)
                    app.colorNumbers()
                }
                console.log(betNumbers)
               
                
            },

            gameInfo: function gameInfo() {
                var ajax = new XMLHttpRequest();
                ajax.open("GET", "games.json", true);
                ajax.send();
                ajax.addEventListener("readystatechange", this.getGameInfo, false);
                
            },

            getGameInfo: function getGameInfo() {
                if (!app.isReady.call(this)) return;
                var data= JSON.parse(this.responseText);
                app.loadGames(data.types)
                app.createButtonGameInfo(data);
                app.setGameType(allGames[0].type)
                
            },

            setGameType: function setGameType(type) {
                
                betNumbers = []
                currentGame = app.getCurrentGame(type)[0]
                $gameInfo.textContent = currentGame.description
                app.createButtonsGameBet(currentGame.range);
            },

            getCurrentGame: function getCurrentGame (type) {
                return allGames.filter((item) => {
                  return item.type === type
                })
            },

            loadGames: function loadGames(data) {
                allGames = data.map(function (item, index) {
                    item.type = item.type.split(' ').join('-')
                    return item
                  })
            },

            createButtonGameInfo: function createButtonGameInfo(data) {
                    data.types.map(function(item) {
                    var $button = document.createElement('button')
                    $buttonsGame.appendChild($button)
                    var buttonTextNode = document.createTextNode(item.type)
                    $button.appendChild(buttonTextNode)
                    $button.setAttribute('class', 'button choose-game')
                    $button.style.border = 'solid ' + item.color
                    $button.style.color = item.color  
                    $button.setAttribute('data-game-type', item.type)         
                })
            },
            removeChild: function removeChild (parent) {
                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild);
                }
              },
            createButtonsGameBet: function createButtonsGameBet(max){
                if ($numbers.firstChild) {
                    app.removeChild($numbers)
                }
                for(var i = 1; i <= max; i++) {
                    var $number = document.createElement('div');
                    $number.setAttribute('class', 'game-number')
                    $number.setAttribute('data-number', i)
                    var $numberText = document.createTextNode(i < 10 ? '0' + i : i)
                    $number.appendChild($numberText)
                    $numbers.appendChild($number)
                }
            },
            isReady: function isReady() {
                return this.readyState === 4 && this.status === 200;
            },
        };
    })();

    app.init();

})(window.DOM);


