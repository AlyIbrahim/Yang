var Element = require("./element");

var ElementComplex = function (name, category, key) {
    Element.call(this, name, category, key)
    this.keys = [];
    this.children = new Array();
}

ElementComplex.prototype = Object.create(Element.prototype);
ElementComplex.prototype.constructor = ElementComplex;

ElementComplex.prototype.addChild = function (element) {
    if(this.keys != undefined){
        for(var i = 0 ;i <this.keys.length ;i++){
            if(this.keys[i] == element.name ){
                element.key = true;
                break;
            }
        }
    }
    this.children.push(element);
}

ElementComplex.prototype.toString = function (level) {
    if(level == undefined){
        level = 0
    }
    
    var parentStr = Element.prototype.toString.call(this,level);
    var indent = repeatconcat("  ", level);
    var childrenStr = "";
    if(this.children.length>0){
        level++;
    for (var x = 0; x < this.children.length; x++) {
        childrenStr = childrenStr + "\n" + indent + this.children[x].toString(level);
        }
    }
    return parentStr + childrenStr;
}

//This method is to create preceding indentation (/t, /t/t, etc..)
var repeatconcat = function (string, num) {
    var repeatedStr;
    if (num == 0) {
        repeatedStr = ""
    } else if (num == 1) {
        repeatedStr = string
    } else {
        repeatedStr = string;
        for (var i = 1; i < num; i++) {
            repeatedStr = repeatedStr + string
        }
    }
    return repeatedStr
}


module.exports = ElementComplex;