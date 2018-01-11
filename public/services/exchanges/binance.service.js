angular.module('coin-tracker')
    .service('binanceService', function($http) {

        var binanceService = {};

        binanceService.getAllPrices = function() {
            return $http.get(baseUrl + '/v1/ticker/allPrices')
                .then(function(resp) {
                    console.log(resp.data);
                    return resp.data;
                }, function(err) {
                    console.log(err);
                })
        };

        return binanceService;

    });