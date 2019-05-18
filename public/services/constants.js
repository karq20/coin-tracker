/**
 * Created by mohit on 13/1/18.
 */
angular.module('coin-tracker')
  .service('constantsService', function () {

    var constantsService = {}

    constantsService.usd = {
        binance: 0
    }

    constantsService.myCoins = {
      binance: [
        { // in my ether wallet
          name: 'ethereum',
          symbol: 'ETH'
        },
        {
          name: 'ripple',
          symbol: 'XRP'
        },
        {
          name: 'eos',
          symbol: 'EOS'
        },
        {
          name: 'litecoin',
          symbol: 'LTC'
        },
        {
          name: 'nano',
          symbol: 'NANO'
        }
      ]
    }

    constantsService.getNumberOfCoins = function () {
      return {
        binance: [
          { // in myetherwallet
            symbol: 'ETH',
            amount: 7.851
          },
          {
            symbol: 'EOS',
            amount: 52.26
          },
          {
            symbol: 'XRP',
            amount: 1366
          },
          {
            symbol: 'LTC',
            amount: 2.83
          },
          {
            symbol: 'NANO',
            amount: 100
          }
        ]
      }
    }

    // constantsService.getMyBitfinexCoinStringQuery = function () {
    //   var bitfinexCoins = constantsService.myCoins['bitfinex']
    //   return bitfinexCoins.reduce(function (acc, val, index) {
    //     return acc + 't' + val.symbol + 'USD' + ',';
    //   }, '')
    // }

    return constantsService;

  })
