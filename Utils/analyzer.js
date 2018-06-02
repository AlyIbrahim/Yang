var Helper = require('../Utils/helper');

var Element = require("../Model/element")
var ElementComplex = require("../Model/elementcomplex")

var pointer = [];
var Analyzer = {
    yang: function (linesArray, startLineNumber, start) {
        if (start == undefined) {
            start = new ElementComplex('Root', 'Root', true);
        }
        if (startLineNumber == undefined) {
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
    json: function (linesArray, start) {
        if (start == undefined) {
            start = new ElementComplex('Root', 'Root', true);
        }
        var line = "";
        var element;
        var name = ""
        var value = ""
        var category = "leaf";
        for (var x = 0; x < linesArray.length; x++) {
            line = linesArray[x].trim();
            if (line == "") {
                continue;
            }
            var token = line.indexOf(":");
            try {
                if (token > 0) {
                    var tokens = line.match(/[a-z-A-Z-0-9_$.*-]+:*[a-z-A-Z-0-9 ,_$.*-]*/g);//.split(":")
                    name = tokens[0].replace(/"/g, "").trim();

                    if (tokens.length > 1) {
                        if (tokens.length = 2) {
                            value = tokens[1]
                        } else if (tokens.length > 2) {
                            tokens.shift();
                            value = ""
                            for (var f = 0; f < tokens.length; f++) {
                                value = value + tokens[f] + ":";
                            }
                            value.slice(0, -1);
                        }
                        category = "leaf";
                        element = new Element(name, category);
                        element.value = value
                        start.addChild(element);
                        name = ""
                    }
                    continue;
                }
                switch (line) {
                    case "{":
                        category = "object";
                        element = new ElementComplex(name, category);
                        // if (name == ""){
                        //     pointer.push(start);
                        //     break;
                        // }
                        start.addChild(element)
                        pointer.push(start);
                        start = element;
                        name = ""
                        break;
                    case "[":
                        category = "list";
                        element = new ElementComplex(name, category);
                        start.addChild(element)
                        pointer.push(start);
                        start = element;
                        name = ""
                        break;
                    case "}":
                    case "]":
                        if (pointer.length == 1) {
                            console.log(start.name)
                        }
                        if ((start.category == "list") && (start.children.length==0)){
                            console.log(start.name)
                            start.category = "leaf-list"
                        }
                        start = pointer.pop();
                        // if((start.category == "list") ){

                        break;
                }
            } catch (err) {
                console.log(x + " " + linesArray[x])
            }
        }
        return start;
    },
    xml: function(linesArray, start){

    }
}
module.exports = Analyzer