var express = require('express');
var router = express.Router();

var Helper = require('../Utils/helper');
var Analyzer = require('../Utils/analyzer');

/* GET home page. */
router.post('/', function (req, res, next) {
    var yang;
    try {
        yang = JSON.parse(req.text);
    } catch (err) {
        yang = req.body
        yang = req.text
    }
    finally {
        console.log(yang);
    }


    var splitted = Helper.RefineAndSplit(yang)
    console.log(Helper.validateYANG(splitted));
    
    console.log("--------------------------START---------------------------")
    var Root = Analyzer.yang(splitted);
    console.log("--------------------------DONE---------------------------")

    console.log(Root.toString(0))
    // res.send(yang);

    res.send(Root.children[0].toString(0));
});

module.exports = router;