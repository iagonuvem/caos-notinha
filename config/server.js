// Incluindo os módulos da aplicação
var express = require('express');
var expressValidator = require('express-validator');
var consign = require('consign');
var bodyParser = require('body-parser');

// Inicializa o express
var app = express();
app.set('view engine' , 'ejs');
app.set('views', './app/views');

// Midlewares
app.use(express.static('./app/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

//AutoLoads 
consign()
    .include('app/routes')
    .then('app/models')
    .then('app/controllers')
    .then('config/dbConnection.js')
    .into(app);

module.exports = app;
