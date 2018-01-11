angular.module('coin-tracker')
    .factory('coinRestClient', function($http) {

        var coinRestClient = {};


        coinRestClient.getAllBinancePrices = function() {

            return $http.get('/api/binance/allPrices').then(function(resp) {
                return resp.data.body;
            })

        }

        coinRestClient.getBitfinexPrices = function(coins) {
            return $http.post('/api/bitfinex/prices', {
                coins: coins
            }).then(function(resp) {
                return resp.data.body;
            })
        }

        coinRestClient.getBitfinexWallets = function() {
            return $http.post('/api/bitfinex/wallets').then(function(resp) {
                return resp.data.body;
            })
        }


        // when landing on the page, get all todos and show them
        coinRestClient.getCoins = function() {
            return $http.get('/api/todos')
                .then(function(resp) {
                    return resp.data;
                },function(err) {
                    console.log('Error while getting: ' + err);
                });
        };

        // when submitting the add form, send the text to the node API
        coinRestClient.createTodo = function(data) {
            return $http.post('/api/todos', data)
                .then(function(resp) {
                    return resp.data;
                }, function(err) {
                    console.log('Error while posting: ' + err);
                });
        };

        // delete a todo after checking it
        coinRestClient.deleteTodo = function(todo) {
            return $http.delete('/api/todos/' + todo._id)
                .then(function(resp) {
                    return resp.data;
                }, function(err) {
                    console.log('Error while deleting: ' + err);
                })
        };




        return coinRestClient;

    })