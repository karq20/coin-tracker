// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var crypto = require('crypto');
var request = require("request");

const nonce = Date.now().toString();
const BFX_API_KEY = '';
const BFX_API_SECRET = '';

// configuration =================

mongoose.connect('mongodb://localhost:27017/todos');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================
app.listen(3000);
console.log("App listening on port 3000");


// model =================================

var Todo = mongoose.model('Todo', {
    text : String
});

// routes ======================================================================

app.all("/api/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    return next();
});




// api ---------------------------------------------------------------------

// Binance prices
var binanceApiBaseUrl = 'https://api.binance.com/api/';
var binanceTickerApi = 'v1/ticker/allPrices';
app.get('/api/binance/allPrices', function(req, res) {

    request({
        uri: binanceApiBaseUrl + binanceTickerApi,
        method: 'GET'
    }, function(err, response, body) {
        if (err) res.send(err);
        res.json(response);
    })

});

// Binance wallet
// GET /api/v3/account


var bitfinexApiBaseUrl = 'https://api.bitfinex.com/';
var bitfinexWalletApi = 'v2/auth/r/wallets';
var bitfinexTickerApi = 'v2/tickers';
var signature = '/api/'+ bitfinexWalletApi + nonce;

signature = crypto
    .createHmac('sha384', BFX_API_SECRET)
    .update(signature)
    .digest('hex');



// Bitfinex prices
app.post('/api/bitfinex/prices', function(req, res) {
    //req.coins comma separated with t
    var url = bitfinexApiBaseUrl + bitfinexTickerApi + '?symbols=' + req.body.coins;
    console.log(url)
    console.log(req.body.coins);
    request({
        uri: url,
        method: 'GET'
    }, function (err, response, body) {
        if (err) res.send(err);

        res.json(response);
    })
})

// Bitfinex wallet
app.post('/api/bitfinex/wallets', function(req, res) {
    request({
        uri: bitfinexApiBaseUrl + bitfinexWalletApi,
        method: 'POST',
        headers: {
            'bfx-nonce': nonce,
            'bfx-apikey': BFX_API_KEY,
            'bfx-signature': signature
        },
        body:{},
        json: true
    },
    function (err, response, body)  {
        if (err) res.send(err);
        res.json(response);
    })
})




// get all todos
app.get('/api/todos', function(req, res) {

    // use mongoose to get all todos in the database
    Todo.find(function(err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(todos); // return all todos in JSON format
    });
});

// create todo and send back all todos after creation
app.post('/api/todos', function(req, res) {

    // create a todo, information comes from AJAX request from Angular
    Todo.create({
        text : req.body.text,
        done : false
    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });

});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
        _id : req.params.todo_id
    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});


// application -------------------------------------------------------------
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});