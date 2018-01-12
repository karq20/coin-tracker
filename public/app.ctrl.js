angular.module('coin-tracker')
    .controller('MainCtrl', function($scope, $http, coinRestClient, binanceService) {

        var bfxCoinString = 'tBTCUSD,tLTCUSD,tETHUSD,tZECUSD,tXMRUSD,tDASHUSD,tXRPUSD,' +
            'tIOTUSD,tEOSUSD,tSANUSD,tOMGUSD,tBCHUSD,tNEOUSD,tETPUSD,' +
            'tQTMUSD,tAVTUSD,tEDOUSD,tBTGUSD,tDATUSD,tQSHUSD,tETCUSD';
        // var bfxCoinString = 'tBTCUSD'

        getAllExchangePrices()

        function getAllExchangePrices() {
            $scope.binancePrices = []
            $scope.bitfinexPrices = [];
            getAllBinancePrices()
            getBitfinexPrices()

        }

        function getAllBinancePrices() {
            coinRestClient.getAllBinancePrices()
                .then(function(resp) {
                    $scope.binancePrices = JSON.parse(resp);
                });
        }

        function getBitfinexPrices() {
            coinRestClient.getBitfinexPrices(bfxCoinString).then(function(resp) {
                processBfxPrices(JSON.parse(resp));
            });
        }

        $scope.bitfinexWallets = [];
        // coinRestClient.getBitfinexWallets()
        //     .then(function(resp) {
        //         $scope.bitfinexWallets = resp;
        //     });


        function processBfxPrices(list) {
            list.forEach(function(p) {
                var priceObj = {};
                console.log(p);
                priceObj.symbol = p[0].substr(1, p[0].length);
                priceObj.price = '$ ' + p[7];
                // priceObj.volume = p[8];
                $scope.bitfinexPrices.push(priceObj);
            })
        }


        function changeBinancePairsToUsdPairs() {
            // var prices = JSON.parse(resp);
            // $scope.btcPrice = prices.filter(function(p) {
            //     if(p.symbol == 'BTCUSDT')
            //         return p.price;
            // })
            // $scope.ethPrice = prices.filter(function(p) {
            //     if(p.symbol == 'ETHUSDT')
            //         return p.price;
            // })
            // $scope.bnbPrice = prices.filter(function(p) {
            //     if(p.symbol == 'BNBUSDT')
            //         return p.price;
            // })
            // console.log($scope.btcPrice)
            // $scope.binancePrices = prices.map(function(p) {
            //     if(p.symbol.substr(-3,3) == 'BTC')
            //         return '$ ' + p*$scope.btcPrice;
            //     if(p.symbol.substr(-3,3) == 'BNB')
            //         return '$ ' + p*$scope.bnbPrice;
            //     if(p.symbol.substr(-3,3) == 'ETH')
            //         return '$ ' + p*$scope.ethPrice;
            // }, [])

        }


        window.setInterval(function() {
            getAllExchangePrices()
        }, 20*60*1000);

    })
