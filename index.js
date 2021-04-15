(function($) {

    "use-strict";

    var app = (function appController() {
        var $buttonsGame = $('[data-js="buttons-game"]').get();
        var $gameTitle = $('strong[data-js="title"]').get();
        var $gameInfo = $('p[data-js="info"]').get();
        var $numbers = $('section[data-js="numbers"]').get();
        var $cart = $('div[data-cart="cart-body"]').get();
        var $cartTotal = $('span[data-cart="total"]').get()
        var $messageEmptyCart = $('span[data-cart="message-empty-cart"]').get()
        var $cartFooter = $('div[data-cart="footer"]').get()
        var allGames = []
        var currentGame = []
        var betNumbers = []
        var bets = []
        return {
            init: function init() {
                this.gameInfo();
                this.initEvents();
            },

            initEvents: function initEvents() {
                document.addEventListener('click', function(e) {

                    var dataset = e.target.dataset
                    var element = e.target

                    if (dataset.gameType)
                        return app.setGameType(dataset.gameType)
                    if (dataset.number)
                        return app.selectNumber(dataset.number)
                    if (dataset.button === 'clean-game')
                        return app.cleanGame()
                    if (dataset.button === 'random-game')
                        return app.completeGame()
                    if (dataset.button === 'add-cart')
                        return app.addCart()
                    if (dataset.button === 'delete')
                        return app.deleteBet(element)
                }, true)
            },
            deleteBet: function deleteBet(item) {

                bets = bets.filter(function(game) {
                    return game.id != item.dataset.value
                })

                app.getTotalBets(bets)
                $cart.removeChild(item.parentElement)

                console.log(bets)

            },
            getTotalBets: function getTotalBets(bets) {
                var total = bets.reduce(function(accumulated, actual) {
                    return accumulated + Number(actual.price)
                }, 0)

                $cartTotal.textContent = 'Total: R$ ' + app.parseToReal(total)
                if (total != 0) {
                    $cartTotal.parentElement.classList.remove('invisible')
                    $cartFooter.classList.remove('invisible')
                    $messageEmptyCart.classList.add('invisible')
                } else {
                    $cartTotal.parentElement.classList.add('invisible')
                    $cartFooter.classList.add('invisible')
                    $messageEmptyCart.classList.add('title')
                    $messageEmptyCart.classList.remove('invisible')
                }
            },
            addCart: function addCart() {
                if (betNumbers.length !== currentGame['max-number']) {
                    alert(`Escolha no mínimo ${currentGame['max-number']} números`)
                    return
                }
                app.renderCart(currentGame, betNumbers)
                app.getTotalBets(bets)
                app.cleanGame()
            },

            renderCart: function renderCart(game, numbers) {
                allGames.map(function(item) {
                    if (item.type === game.type) {
                        var currentBet = {
                            id: app.createId(),
                            type: item.type,
                            price: item.price,
                            color: item.color,
                            numbers: numbers
                        }
                        var cartItem = app.renderCartItem(currentBet)
                        bets.push(currentBet)
                        $cart.appendChild(cartItem)
                    }
                })
            },
            createId: function createId() {
                return Date.now();
            },
            renderCartItem: function renderCartItem(bet) {
                var cartContainer = document.createElement('div')
                var cartButtonDelete = document.createElement('button')
                var cartInfoContainer = document.createElement('div')
                var cartPriceContainer = document.createElement('div')
                var numbersBettext = document.createElement('p')
                var betTitletext = document.createElement('p')
                var betPrice = document.createElement('p')
                cartContainer.setAttribute('class', 'cart-item-container')
                cartButtonDelete.setAttribute('data-button', 'delete')
                cartButtonDelete.setAttribute('data-value', bet.id)
                cartButtonDelete.setAttribute('class', 'button-delete')

                betTitletext.style.color = bet.color;
                cartInfoContainer.setAttribute('class', 'cart-info-container')
                cartPriceContainer.setAttribute('class', 'cart-price-container')
                cartInfoContainer.style.borderLeft = '3px ' + bet.color + ' solid'

                numbersBettext.textContent = bet.numbers
                betTitletext.textContent = bet.type
                betPrice.textContent = 'R$ ' + app.parseToReal(bet.price)

                cartContainer.appendChild(cartButtonDelete)

                cartInfoContainer.appendChild(numbersBettext)
                cartPriceContainer.appendChild(betTitletext)
                cartPriceContainer.appendChild(betPrice)
                cartInfoContainer.appendChild(cartPriceContainer)

                cartContainer.appendChild(cartInfoContainer)

                return cartContainer
            },
            completeGame: function completeGame() {
                var game = allGames.filter(function(game) {
                    return game.type === currentGame.type
                })[0]
                var  total = game['max-number'] - betNumbers.length
                console.log('Total ' +total)
                for (var i = 1; i <= total; i++) {
                    var number = Math.ceil(Math.random() * game.range)
                   number < 10 ? (number = '0' + number) : number
                    if (app.numberBetExist(betNumbers, number)) {
                        i--
                    }else{
                        betNumbers.push(number)
                    }
                    
                    
                }
                console.log('Numeros ' + betNumbers)
                app.colorNumbers()

            },
            parseToReal: function parseToReal(value) {
                return value.toFixed(2).split('.').join(',')
            },
            cleanGame: function cleanGame() {
                betNumbers = []
                var $buttonSelected = $('.game-number_selected').get()
                if ($buttonSelected) {
                    $buttonSelected.classList.remove('game-number_selected')
                    cleanGame()
                }
            },
            colorNumbers: function colorNumbers() {
                betNumbers.map(function(number) {
                    var element = $('div[data-number="' + number + '"]').get()
                    element.classList.add('game-number_selected')
                })
            },
            removeNumber: function removeNumber(number) {
                var item = $('div[data-number="' + number + '"]').get()
                item.classList.remove('game-number_selected')
            },
            numberBetExist: function numberBetExist(array, number) {
                return array.some(function(item) {
                    return item == number
                })
            },
            arrayRemove: function arrayRemove(arr, value) {
                return arr.filter(function(item) {
                    return item != value;
                });
            },
            selectNumber: function selectNumber(currentNumber) {
                var game = allGames.filter((item) => {
                    return item.type == currentGame.type
                })[0]

                if (app.numberBetExist(betNumbers, currentNumber)) {
                    console.log('Item reperido')
                    betNumbers = app.arrayRemove(betNumbers, currentNumber)
                    console.log(betNumbers)
                    app.removeNumber(currentNumber)
                    return
                }

                if (game['max-number'] === betNumbers.length) {
                    	alert('Número máximo já selecionado')
                }


                if (game['max-number'] > betNumbers.length) {
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
                var data = JSON.parse(this.responseText);
                app.loadGames(data.types)
                app.createButtonGameInfo(data);
                app.setGameType(allGames[0].type)

            },
            setGameType: function setGameType(type) {

                betNumbers = []
                app.changeButtonGameType(type)
                currentGame = app.getCurrentGame(type)[0]
                $gameInfo.textContent = currentGame.description
                $gameTitle.textContent = currentGame.type
                app.createButtonsGameBet(currentGame.range);


            },
            
            getPreviousButtonGame: function getPreviousButtonGame() {
                return $('[data-game-type-selected="true"]').get()
            },

            getCurrentButtonGame: function getCurrentButtonGame(type) {
                return $('button[data-game-type="' + type + '"]').get()
            },

            setStyleToPreviusButton: function setStyleToPreviusButton() {
                app.getPreviousButtonGame().style.color = currentGame.color
                app.getPreviousButtonGame().style.background = '#FFF'
                app.getPreviousButtonGame().setAttribute('data-game-type-selected', 'false')
            },

            styleCurrentButtonGame: function styleCurrentButtonGame(type) {
                allGames.map(function(game) {
                    if (game.type === type) {
                        app.getCurrentButtonGame(type).style.color = '#FFF'
                        app.getCurrentButtonGame(type).style.background = game.color
                        app.getCurrentButtonGame(type).setAttribute( 'data-game-type-selected', 'true')
                    }
                })
            },

            changeButtonGameType: function changeButtonGameType(type) {
                if (app.getPreviousButtonGame()) {
                    app.setStyleToPreviusButton()
                }
                app.styleCurrentButtonGame(type)
            },

            getCurrentGame: function getCurrentGame(type) {
                return allGames.filter((item) => {
                    return item.type === type
                })
            },

            loadGames: function loadGames(data) {
                allGames = data.map(function(item, index) {
                    item.type = item.type.split(' ').join('-')
                    return item
                })
            },

            createButtonGameInfo: function createButtonGameInfo(data) {
                console.log(data)
                data.types.map(function(item) {
                    var $button = document.createElement('button')
                    var buttonTextNode = document.createTextNode(item.type)
                    $button.appendChild(buttonTextNode)
                    $button.setAttribute('class', 'button choose-game')
                    $button.style.border = 'solid ' + item.color
                    $button.style.color = item.color
                    $button.setAttribute('data-game-type', item.type)
                    $buttonsGame.appendChild($button)
                })
            },
            removeChild: function removeChild(parent) {
                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild);
                }
            },
            createButtonsGameBet: function createButtonsGameBet(max) {
                if ($numbers.firstChild) {
                    app.removeChild($numbers)
                }
                for (var i = 1; i <= max; i++) {
                    var $number = document.createElement('div');
                    $number.setAttribute('class', 'game-number')
                    $number.setAttribute('data-number', i < 10 ? '0' + i : i)
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