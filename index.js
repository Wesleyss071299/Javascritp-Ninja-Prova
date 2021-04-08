(function($) {

    "use-strict";

    var app = (function appController() {
        return {
            init: function init() {
                this.gameInfo();
                console.log("aqui")
            },
            gameInfo: function gameInfo() {
                var ajax = new XMLHttpRequest();
                ajax.open("GET", "games.json", true);
                ajax.send();
                ajax.addEventListener("readystatechange", this.getGameInfo, false);
                
            },
            getGameInfo: function getGameInfo() {
                if (!app.isReady.call(this)) return;
                var data = JSON.parse(this.responseText);
                var $buttonsGame = $('[data-js="buttons-game"]').get();
                $buttonsGame.appendChild(app.createButtonGameInfo(data));
                
            },
            createButtonGameInfo: function createButtonGameInfo(data) {
                data.map(function(item) {
                    var $button = document.createElement("button")
                    $button.textContent = item.type;
                    return $button           
                })
            },
            isReady: function isReady() {
                return this.readyState === 4 && this.status === 200;
            },
        };
    })();

    app.init();
})(window.DOM);