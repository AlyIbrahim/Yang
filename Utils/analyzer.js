var Helper = require('../Utils/helper');

var Element = require("../Model/element")
var ElementComplex = require("../Model/elementcomplex")

pointer = [];
var Analyzer = {
    yang: function (linesArray, startLineNumber, start) {
        if (start == undefined) {
            start = new ElementComplex('Root', 'Root', true);
        }
        if (startLineNumber == undefined){
            startLineNumber = 0
        }
        for (var x = startLineNumber; x < linesArray.length; x++) {
            var line = linesArray[x].trim();
            var splittedline = line.split(" ")
            var element;
            switch (splittedline[0]) {
                case "key":
                    start.keys = Helper.setKeys(line);
                    break;
                case "leaf":
                    element = new Element(splittedline[1], splittedline[0], false)
                    start.addChild(element)
                    break;
                case "leaf-list":
                    element = new Element(splittedline[1], splittedline[0], false)
                    start.addChild(element)
                    break;
                case "list":
                    element = new ElementComplex(splittedline[1], splittedline[0], false)
                    pointer.push(start);
                    x = Analyzer.yang(linesArray, ++x, element);
                    start = pointer.pop();
                    start.addChild(element);
                    break;
                case "container":
                    element = new ElementComplex(splittedline[1], splittedline[0], false)
                    pointer.push(start);
                    x = Analyzer.yang(linesArray, ++x, element);
                    start = pointer.pop();
                    start.addChild(element);
                    break;
                case "{":
                case "[":
                    pointer.push(splittedline[0]);
                    break;
                case "}":
                case "]":
                    if ((pointer[pointer.length - 1] == "{") || (pointer[pointer.length - 1] == "[")) {
                        pointer.pop();
                        if ((pointer[pointer.length - 1] != "{") && (pointer[pointer.length - 1] != "[")) {
                        return x++;
                        }
                    }
                    break;
            }
        }
        pointer.pop();
        return start;
    },
    json : function(linesArray){}
}
module.exports = Analyzer