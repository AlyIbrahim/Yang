var Element = function(name, category, key){

    this.name = name;
    this.category = category;
    this.type = "string"
    this.key = keyCho(key);
    // this.optional = optional;
    // this.maxOccurence = (function(optional){
    //     if(optional){
    //         return 1
    //     }
    //     return "unbounded" ;
    // })()

    function keyCho(key){
        // if(key){
        //     return "KEY"
        // }
        // return "NOTKEY" 
        return key
    };


    
}

function keyPrint(keyko){
            if(keyko){
            return " : KEY"
        }
        return ""
}

Element.prototype.keyCheck = function(key){
    if(key){
        return "KEY"
    }
    return "NOTKEY" 
}

Element.prototype.toString = function(level){
    if(level == undefined){
        level = 0
    }
    var indent = repeatconcat("  ", level);
    return indent +  this.name + " : " + this.category + keyPrint(this.key);
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

module.exports = Element;