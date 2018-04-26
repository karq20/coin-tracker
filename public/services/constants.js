/**
 * Created by mohit on 13/1/18.
 */
angular.module('coin-tracker')
  .service('constantsService', function () {

    var constantsService = {}

    constantsService.myCoins = {
      bitfinex: [
        {
          name: 'eos',
          symbol: 'EOS'
        },
      ],
      binance: [
        { // in my ether wallet
          name: 'ethereum',
          symbol: 'ETH'
        },
        // {
        //   name: 'bitcoin',
        //   symbol: 'BTC'
        // },
        {
          name: 'binance-coin',
          symbol: 'BNB'
        },
        {
          name: 'nano',
          symbol: 'NANO'
        }
      ]
    }

    constantsService.getNumberOfCoins = function () {
      return {
        bitfinex: [
          {
            symbol: 'EOS',
            amount: 256.84
          },
        ],
        binance: [
          { // in myetherwallet
            symbol: 'ETH',
            amount: 2
          },
          // {
          //   symbol: 'BTC',
          //   amount: 0
          // },
          {
            symbol: 'BNB',
            amount: 132.13
          },
          {
            symbol: 'NANO',
            amount: 100
          }
        ]
      }
    }

    constantsService.getMyBitfinexCoinStringQuery = function () {
      var bitfinexCoins = constantsService.myCoins['bitfinex']
      return bitfinexCoins.reduce(function (acc, val, index) {
        return acc + 't' + val.symbol + 'USD' + ',';
      }, '')
    }

    return constantsService;

  })
