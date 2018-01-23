angular.module('coin-tracker')
  .factory('coinRestClient', function($http) {

    var coinRestClient = {};

    coinRestClient.getCexIoPrices = function() {
      return $http.post('/api/cex/prices')
        .then(function(resp) {
          return resp.data.body;
        })
    };

    coinRestClient.getAllBinancePrices = function() {
      return $http.post('/api/binance/allPrices')
        .then(function(resp) {
          return resp.data.body;
        })
    };

    coinRestClient.getBitfinexPrices = function(coins) {
      return $http.post('/api/bitfinex/prices', { coins: coins })
        .then(function(resp) {
          return resp.data.body;
        })
    };

    coinRestClient.getBitgrailPrices = function() {
      return $http.post('/api/bitgrail/prices')
        .then(function(resp) {
          return resp.data.body;
        })
    };

    coinRestClient.getKucoinPrices = function() {
      return $http.post('/api/kucoin/prices')
        .then(function(resp) {
          return resp.data.body;
        })
    };


    // coinRestClient.getBitfinexWallets = function() {
    //   return $http.post('/api/bitfinex/wallets')
    //     .then(function(resp) {
    //       return resp.data.body;
    //     })
    // }











    return coinRestClient;

  })