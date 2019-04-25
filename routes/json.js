var express = require('express');
var router = express.Router();

var Helper = require('../Utils/helper');
var Analyzer = require('../Utils/analyzer');

/* GET home page. */
router.post('/', function (req, res, next) {
    var json = req.text;

    var splitted = Helper.RefineAndSplitJSON(json);
    console.log(splitted);
    var Root = Analyzer.json(splitted);
    // res.send(json);
    console.log(Root.toString(0))

    res.send(Root.children[0].toString(0));
});
module.exports = router;