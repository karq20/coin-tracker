angular.module('coin-tracker')
  .factory('coinRestClient', function($http) {

    var coinRestClient = {};

    coinRestClient.getAllCoinsPrices = function() {
      return $http.post('/api/binance/allPrices')
        .then(function(resp) {
          return resp.data.body;
        })
    };



    return coinRestClient;

  })
