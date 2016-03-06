'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2');
var config = require('../config');
var superagent = require('superagent');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    done(null, {id: id});
});

passport.use(new OAuth2Strategy({
    authorizationURL: config.authorizationURL,
    tokenURL: config.tokenURL,
    clientID: process.env.TOODLEM_CLIENT_ID,
    clientSecret: process.env.TOODLEM_CLIENT_SECRET,
    callbackURL: config.callbackURL,
    skipUserProfile:true
}, function (accessToken, refreshToken, profile, done) {
    done(null, {accessToken: accessToken});
}));

passport.use('oauth2-list', new OAuth2Strategy({
    authorizationURL: config.authorizationURL,
    tokenURL: config.tokenURL,
    clientID: process.env.TOODLEM_CLIENT_ID,
    clientSecret: process.env.TOODLEM_CLIENT_SECRET,
    callbackURL: config.callbackURL,
    skipUserProfile: true
}, function (accessToken, refreshToken, profile, done) {
    done(null, {accessToken: accessToken});
}));

router.get('/', passport.authenticate('oauth2'));

router.get('/oauthRedirect', passport.authenticate('oauth2', {failureRedirect: '/someError'}), function (req, res) {

});

router.get('/list-tournaments',passport.authenticate('oauth2-list'));

router.get('/list-tournaments-callback', passport.authenticate('oauth2-list', {failureRedirect: '/someError'}), function (req, res) {
    console.log(req.session.passport);
    superagent
        .get('http://0.0.0.0:9042/api/tournament-list/list-all')
        .set('Authorization', `token ${req.session.passport.user.accessToken}`)
        .end(function (err, data) {
            console.log(data);
            res.send(data);
        });
});


router.all('/*', function (req, res) {
    res.sendStatus(404);
});

module.exports = router;