/**
 * Created by mohit on 13/1/18.
 */
angular.module('coin-tracker')
  .service('constantsService', function () {

    var constantsService = {}

    constantsService.usd = {
        bitfinex: 3304
    }

    constantsService.myCoins = {
      bitfinex: [
          {
              name:'Btc',
              symbol: 'BTC'
          },
          {
              name: 'Monero',
              symbol:'XMR'
          }
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
        // {
        //   name: 'binance-coin',
        //   symbol: 'BNB'
        // },
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
                symbol: 'BTC',
                amount: 0.20542
            },
            {
                symbol:'XMR',
                amount: 4.005
            }
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
