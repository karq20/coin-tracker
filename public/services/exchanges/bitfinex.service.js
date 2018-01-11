angular.module('coin-tracker')
    .service('bitfinexService', function($http) {

        var bitfinexService = {};

        bitfinexService.getWallets = function() {
            return $http.get(baseUrl + '/v1/ticker/allPrices')
                .then(function(resp) {
                    console.log(resp.data);
                    return resp.data;
                }, function(err) {
                    console.log(err);
                })
        };


        return bitfinexService;


    });