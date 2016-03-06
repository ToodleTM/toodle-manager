'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var mainRouter = require('./routes/mainRouter');
var tournamentRouter = require('./routes/tournamentRouter');
var app = express();
var passport = require('passport');
var MemoryStore = session.MemoryStore;

app.set('port', (process.env.PORT || 3000));

app.use(session({
    secret: 'bananas!',
    saveUninitialized:true,
    resave:true,
    store: new MemoryStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use('/login', mainRouter);
app.use('/edit-tournament', tournamentRouter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
