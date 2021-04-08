(function($) {

    "use-strict";

    var app = (function appController() {
        var $buttonsGame = $('[data-js="buttons-game"]').get();
        var $gameInfo = $('p[data-js="info"]').get();
        var $numbers = $('section[data-js="numbers"]').get();
        var allGames = []
        var currentGame = []
        return {
            init: function init() {
                this.gameInfo();
                this.initEvents();     
            },

            initEvents: function initEvents() {
                document.addEventListener('click',  function(e) {
                    var dataset = e.target.dataset
                    console.log(dataset.gameType)
                    if (dataset.gameType) 
                        return app.setGameType(dataset.gameType)
                }, true)
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