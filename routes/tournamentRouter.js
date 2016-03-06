'use strict';
var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next){
    res.send(req.params.id)
});

router.all('/*', function (req, res) {
    res.send(404);
});

module.exports = router;