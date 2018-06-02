var helper = {

    validateYANG: function (linesArray) {
        var stack = new Array()
        for (x = 0; x < linesArray.length; x++) {
            switch (linesArray[x]) {
                case "{":
                case "[":
                    console.log(x + ": Open " + linesArray[x])
                    stack.push(linesArray[x])
                    break;
                case "}":
                    if (stack.length == 0) {
                        return { valid: false, error: "Extra closing Braces }" };
                    }
                    if (stack[stack.length - 1] == "{") {
                        stack.pop(linesArray[x])
                    }
                    else {
                        return { valid: false, error: "Invalid YANG trying to [ with }" };
                    }
                    break;
                case "]":
                    if (stack.length == 0) {
                        return { valid: false, error: "Extra closing Bracket ]" };
                    }
                    if (stack[stack.length - 1] == "[") {
                        stack.pop(linesArray[x])
                    }
                    else {
                        return { valid: false, error: "Invalid YANG trying to { with ]" };
                    }
                    break;
            }
        }
        if (stack.length == 0) {
            return { valid: true, error: "open and closed brackets shows a valid Yang" };
        } else {
            return { valid: false, error: "Unclosed brckets" };
        }
    },
    RefineAndSplit: function (inputText) {
        
        var refined = inputText
        var embededStr = "EMBEDEDJSON"
        var embedregex = new RegExp("\(\"{\)\[\\\\ \":,;_{\\[a-zA-Z0-9\\]}-\]+\(}\"\)","g")
        var embededValues = refined.match(embedregex);
        var embededStructure = {};
        if(embededValues != null){
        for (var x = 0; x<embededValues.length;x++){
            embededStructure.key = embededStr + x;
            embededStructure.value = embededValues[x];
            refined = refined.replace(embededValues[x],embededStr + x)
        }
    }
        var anchors = ["{", "}", "\\[", "\\]", ";", ","]
        var regex;

        // regex = new RegExp("\""+anchors[0]);
        // refined = refined.replace(regex, "<");
        // regex = new RegExp("\""+anchors[1]);
        // refined = refined.replace(regex, ">");
        for (var i = 0; i<anchors.length;i++){
            regex = new RegExp(anchors[i], "g");
            refined = refined.replace(regex, '\n'+ anchors[i].replace(/\\/g, "") + '\n')
        }
        if(embededValues != null){
        for (var x = 0; x<embededValues.length;x++){
            refined = refined.replace(embededStr + x, embededValues[x])
        }
    }
        // refined = refined.replace(">", "\"}");
        // refined = refined.replace("<", "\"{");
        // var open = inputText.replace(/{/g, '\n{\n');
        // var close = open.replace(/}/g, '\n}\n');
        // var open = inputText.replace(/\[/g, '\n[\n');
        // var close = open.replace(/\]/g, '\n]\n');
        // var lines = close.replace(/;/g, '\n');
        var splitted = refined.split(/\r?\n/g);
        return splitted;
    },
    setKeys: function (keyString) {
        var keys = keyString.match(/[a-zA-Z-]{1,}/g)
        keys.shift();
        return keys
    }
}
module.exports = helper;