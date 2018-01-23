angular.module('coin-tracker')
  .controller('MainCtrl', function($scope, $http, coinRestClient, constantsService, $q) {

    var promises = []
    var bfxString = constantsService.getMyBitfinexCoinStringQuery()

    var listOfProcessFunctions = [
      // processCexPrices,
      processBinancePrices,
      processBitfinexPrices,
      processBitgrailPrices,
      processKucoinPrices
    ]

    getAllExchangePrices()

    function getAllExchangePrices() {
      $scope.cexPrices = []
      $scope.binancePrices = []
      $scope.bitfinexPrices = []
      $scope.bitgrailPrices = []
      $scope.kucoinPrices = []

      // promises.push(coinRestClient.getCexIoPrices())
      promises.push(coinRestClient.getAllBinancePrices())
      promises.push(coinRestClient.getBitfinexPrices(bfxString))
      promises.push(coinRestClient.getBitgrailPrices())
      promises.push(coinRestClient.getKucoinPrices())
    }

    $q.all(promises).then(function(responses) {
      listOfProcessFunctions.forEach(function(process, index) {
        process(responses[index])
      })
      calculateTotalUsd()
    })


    function processCexPrices(list) {
      var prices = JSON.parse(list).data
      $scope.cexPrices = prices.map(function(p) {
        p.price = Number(p.lprice).toFixed(2)
        p.symbol = p.symbol1
        return p
      }, [])
    }

    function processBinancePrices(list) {
      var prices = JSON.parse(list);
      $scope.binanceBtcPrice = prices.filter(function(p) {
        if(p.symbol == 'BTCUSDT')
          return p.price;
      })[0].price
      $scope.binanceBtcPrice = Number($scope.binanceBtcPrice).toFixed(2)

      $scope.binancePrices = prices.map(function(p) {
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
      $scope.binancePrices.unshift({symbol:'BTC', price: $scope.binanceBtcPrice})
    }

    function processBitfinexPrices(list) {
      var prices = JSON.parse(list)
      prices.forEach(function(p) {
        var priceObj = {};
        priceObj.symbol = p[0].substr(1, p[0].length-4);
        priceObj.price = Number(p[7]).toFixed(2);
        $scope.bitfinexPrices.push(priceObj);
      })
    }

    function processBitgrailPrices(list) {
      var xrbPricePair = JSON.parse(list).response["BTC"][0]
      var xrbPair = xrbPricePair.market.split('/')[0]
      var xrbPrice = parseFloat(xrbPricePair.last)
      xrbPrice = xrbPrice*$scope.binanceBtcPrice
      $scope.bitgrailPrices = [
        {
          symbol: xrbPair,
          price: xrbPrice.toFixed(2)
        }
      ]
    }

    function processKucoinPrices(list) {
      var prices = JSON.parse(list).data

      var btcPrice = prices.filter(function(p) {
        if(p.symbol == 'BTC-USDT')
          return p.lastDealPrice;
      })[0].lastDealPrice
      btcPrice = Number(btcPrice).toFixed(2)

      $scope.kucoinPrices = prices.map(function(p) {
        if(p.symbol.substr(-3,3) == 'BTC') {
          var usdPrice = p.lastDealPrice*btcPrice
          return {
            symbol: p.symbol.replace('-BTC',''),
            price: usdPrice.toFixed(2)
          };
        }
      }, []).filter(function(p) {
        if(p) return p
      })

    }


    function findPriceOfCoin(prices, symbol) {
      var lo = prices.filter(function(p) {
        return p.symbol == symbol
      })[0]
        return lo.price
    }
    function findAmountOfCoin(exchange, symbol) {
      return constantsService.getNumberOfCoins()
        .filter(function(n) {
          return n.exchange == exchange;
        })[0]
        .coins
        .filter(function(c) {
          return c.symbol == symbol;
        })[0].amount
    }

    function calculateTotalUsd() {
      $scope.totalUsd = 0;
      $scope.exchangeWiseTotal = { cex: 0, bitfinex: 0, binance: 0, kucoin: 0, bitgrail: 0 }
      var coinsAmount = constantsService.getNumberOfCoins()
      constantsService.myCoins.forEach(function(c) {

        c.coins.forEach(function(coin) {
          var amount = findAmountOfCoin(c.location.name, coin.symbol)
          var price;
          switch(c.location.name) {
            case 'cex':
              price = findPriceOfCoin($scope.cexPrices, coin.symbol)
              $scope.exchangeWiseTotal['cex'] += price*amount
              break;
            case 'bitfinex':
              price = findPriceOfCoin($scope.bitfinexPrices, coin.symbol)
              $scope.exchangeWiseTotal['bitfinex'] += price*amount
              break;
            case 'binance':
              price = findPriceOfCoin($scope.binancePrices, coin.symbol)
              $scope.exchangeWiseTotal['binance'] += price*amount
              break;
            case 'kucoin':
              price = findPriceOfCoin($scope.kucoinPrices, coin.symbol)
              $scope.exchangeWiseTotal['kucoin'] += price*amount
              break;
            case 'bitgrail':
              price = findPriceOfCoin($scope.bitgrailPrices, coin.symbol)
              $scope.exchangeWiseTotal['bitgrail'] += price*amount
          }
          $scope.totalUsd = $scope.totalUsd + price*amount
        })
      })

      $scope.totalUsd = $scope.totalUsd.toFixed(2)

      console.log("total USD = ", $scope.totalUsd)
      console.log("total exchange wise USD = ", $scope.exchangeWiseTotal)

    }

    $scope.toFixed = function (num) {
      return Number(num).toFixed(2);
    }

    window.setInterval(function() {
      getAllExchangePrices()
    }, 20*60*1000);


    // $scope.bitfinexWallets = [];
    // function getBitfinexWallets() {
    //   coinRestClient.getBitfinexWallets()
    //     .then(function(resp) {
    //       $scope.bitfinexWallets = resp;
    //     });
    // }

  })
