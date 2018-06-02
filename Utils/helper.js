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
        var open = inputText.replace(/{/g, '\n{\n');
        var close = open.replace(/}/g, '\n}\n');
        var lines = close.replace(/;/g, '\n');
        var splitted = lines.split(/\r?\n/g);
        return splitted;
    },
    setKeys: function (keyString) {
        var keys = keyString.match(/[a-zA-Z-]{1,}/g)
        keys.shift();
        return keys
    }
}
module.exports = helper;