angular.module('coin-tracker')
  .controller('MainCtrl', function($scope, $http, coinRestClient, constantsService, $q) {

    $scope.currentNetWorth = 0
    $scope.dollarRate = 71.5
    var promises = []
    // var bfxString = constantsService.getMyBitfinexCoinStringQuery()
    $scope.amountByExchange = constantsService.getNumberOfCoins()
    $scope.myCoins = constantsService.myCoins
    $scope.selected = 'prices'

    getAllExchangePrices()

    function getAllExchangePrices() {
      $scope.binancePrices = []
      coinRestClient.getAllCoinsPrices().then(function(resp) {
        console.log(resp)
        processBinancePrices(resp)
        calculateTotalUsd()
      })
    }

    function getBtcPriceFromStdExchange(prices) {
      $scope.binanceBtcPrice = prices.filter(function(p) {
        if(p.symbol == 'BTCUSDT')
          return p.price;
      })[0].price
      $scope.binanceBtcPrice = Number($scope.binanceBtcPrice).toFixed(2)
      $scope.binanceBtcInrPrice = $scope.binanceBtcPrice * $scope.dollarRate;
    }

    function processBinancePrices(list) {
      var prices = JSON.parse(list);

      getBtcPriceFromStdExchange(prices)

      var allBinancePrices = prices.map(function(p) {
        if(p.symbol.substr(-3,3) == 'BTC') {
          var usdPrice = p.price*$scope.binanceBtcPrice
          return {
            symbol: p.symbol.replace('BTC',''),
            price: usdPrice.toFixed(2)
          };
        }
      }, []).filter(function(p) {
        if(p) return p
      })

      allBinancePrices.map(function(p) {
        $scope.myCoins.binance.map(function(coin) {
          if(coin.symbol == p.symbol) $scope.binancePrices.push(p)
        })
        if(p.symbol == 'ETHUSDT') $scope.ethPrice = p.price;
        if(p.symbol == 'NANOBTC') $scope.nanoPrice = p.price*$scope.binanceBtcPrice;
        if(p.symbol == 'BNBUSDT') $scope.bnbPrice = p.price;

      })
      // $scope.binancePrices.unshift({symbol:'BTC', price: $scope.binanceBtcPrice})
    }

    function processBitfinexPrices(list) {
      var prices = JSON.parse(list)
      prices.forEach(function(p) {
        var priceObj = {};
        priceObj.symbol = p[0].substr(1, p[0].length-4);
        priceObj.price = Number(p[7]).toFixed(2);
        $scope.bitfinexPrices.push(priceObj);
        if(priceObj.symbol == 'EOS') $scope.eosPrice = priceObj.price;

      })
    }

    function findPriceOfCoin(prices, symbol) {
      return prices.filter(function(p) {
        return p.symbol == symbol
      })[0].price
    }

    function findAmountOfCoin(exchange, symbol) {
      return $scope.amountByExchange[exchange].filter(function(c) {
        return c.symbol == symbol;
      })[0].amount
    }

    function calculateTotalUsd() {
      $scope.totalUsd = 0;
      $scope.exchangeWiseUsdTotal = { cex: 0, bitfinex: 0, binance: 0, kucoin: 0, bitgrail: 0 }
      var coins = $scope.myCoins;
      for(c in coins) {
        coins[c].forEach(function(coin) {
          var amount = findAmountOfCoin(c, coin.symbol)
          var price;
          switch(c) {
            case 'bitfinex':
              price = findPriceOfCoin($scope.bitfinexPrices, coin.symbol)
              $scope.exchangeWiseUsdTotal['bitfinex'] += price*amount
              break;
            case 'binance':
              price = findPriceOfCoin($scope.binancePrices, coin.symbol)
              $scope.exchangeWiseUsdTotal['binance'] += price*amount
              break;
          }
          $scope.totalUsd = $scope.totalUsd + price*amount
        })
      }

      $scope.bitfinexUsd = constantsService.usd.bitfinex;
      $scope.exchangeWiseUsdTotal.bitfinex += $scope.bitfinexUsd;

      $scope.totalUsd += $scope.bitfinexUsd;

      $scope.totalUsd = $scope.toFixed($scope.totalUsd, 2)
      $scope.totalBtc = $scope.totalUsd/$scope.binanceBtcPrice
      $scope.totalBtc = $scope.toFixed($scope.totalBtc, 6)
      $scope.exchangeWiseBtcTotal = {}
      for(ex in $scope.exchangeWiseUsdTotal) {
        $scope.exchangeWiseUsdTotal[ex] = $scope.toFixed($scope.exchangeWiseUsdTotal[ex], 2)
        $scope.exchangeWiseBtcTotal[ex] = $scope.exchangeWiseUsdTotal[ex]/$scope.binanceBtcPrice
        $scope.exchangeWiseBtcTotal[ex] = $scope.toFixed($scope.exchangeWiseBtcTotal[ex], 6)
      }
      $scope.totalInr = $scope.totalUsd * $scope.dollarRate;
    }

    $scope.toFixed = function (num, prec) {
      return Number(num).toFixed(prec);
    }

    window.setInterval(function() {
      getAllExchangePrices()
    }, 20*60*1000);


  })
