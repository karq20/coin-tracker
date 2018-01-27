angular.module('coin-tracker')
  .controller('MainCtrl', function($scope, $http, coinRestClient, constantsService, $q) {

    var promises = []
    var bfxString = constantsService.getMyBitfinexCoinStringQuery()
    $scope.amountByExchange = constantsService.getNumberOfCoins()
    $scope.myCoins = constantsService.myCoins;
    $scope.selected = 'prices'

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

    function getBinanceBtcPrice(prices) {
      $scope.binanceBtcPrice = prices.filter(function(p) {
        if(p.symbol == 'BTCUSDT')
          return p.price;
      })[0].price
      $scope.binanceBtcPrice = Number($scope.binanceBtcPrice).toFixed(2)
    }

    function processBinancePrices(list) {
      var prices = JSON.parse(list);

      getBinanceBtcPrice(prices)

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
          if(coin.symbol == p.symbol)
            $scope.binancePrices.push(p)
        })
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
      })
    }

    function processBitgrailPrices(list) {
      var xrbPrice = JSON.parse(list)['response']['BTC']['markets']['XRB/BTC']['last']
      xrbPrice = xrbPrice*$scope.binanceBtcPrice
      $scope.bitgrailPrices = [
        {
          symbol: 'XRB',
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

      var allKucoinPrices = prices.map(function(p) {
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

      allKucoinPrices.map(function(p) {
        $scope.myCoins.kucoin.map(function(coin) {
          if(coin.symbol == p.symbol)
            $scope.kucoinPrices.push(p)
        })
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
      $scope.exchangeWiseTotal = { cex: 0, bitfinex: 0, binance: 0, kucoin: 0, bitgrail: 0 }
      var coins = $scope.myCoins;
      for(c in coins) {
        coins[c].forEach(function(coin) {
          var amount = findAmountOfCoin(c, coin.symbol)
          var price;
          switch(c) {
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
      }

      $scope.totalUsd = $scope.totalUsd.toFixed(2)

      for(ex in $scope.exchangeWiseTotal) {
        $scope.exchangeWiseTotal[ex] = $scope.exchangeWiseTotal[ex].toFixed(2)
      }

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
