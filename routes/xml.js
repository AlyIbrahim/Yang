var express = require('express');
var router = express.Router();

var Helper = require('../Utils/helper');
var Analyzer = require('../Utils/analyzer');

/* GET home page. */
router.post('/', function (req, res, next) {
    var xml;
    
    try{
        xml = req.text
        var linesArray = Helper.RefineAndSplitXML(xml)
        var validation = Helper.validateXML(linesArray);
        if (validation.valid == true){
            var Root = Analyzer.xml(linesArray)
            res.send(Root.toString());
        }else{
            res.send(validation)
        }
    }catch(err){
        console.log(err)
    }
});
module.exports = router;