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
                        return { valid: false, msg: "Extra closing Braces }" };
                    }
                    if (stack[stack.length - 1] == "{") {
                        stack.pop(linesArray[x])
                    }
                    else {
                        return { valid: false, msg: "Invalid YANG trying to [ with }" };
                    }
                    break;
                case "]":
                    if (stack.length == 0) {
                        return { valid: false, msg: "Extra closing Bracket ]" };
                    }
                    if (stack[stack.length - 1] == "[") {
                        stack.pop(linesArray[x])
                    }
                    else {
                        return { valid: false, msg: "Invalid YANG trying to { with ]" };
                    }
                    break;
            }
        }
        if (stack.length == 0) {
            return { valid: true, msg: "open and closed brackets shows a valid Yang" };
        } else {
            return { valid: false, msg: "Unclosed brckets" };
        }
    },
    validateXML: function (linesArray) {
        // Openning Tags <[\w_:?!-]+>?
        // Closing Tags (<*\/[a-z_]*>)|\?>
        // Value [^\s>][\w ;:'.-]+\w(?=[\s]*\<)
        var stack = new Array()
        // For each line of the XML document
        var openregex = new RegExp("<[\\w_:?!-]+>?", "g")
        var closeregex = new RegExp("(<*\\/[a-z_]*>)|\\?>", "g")
        //var attrregex = new RegExp("([\\w-]+=\"[^\"]+\")|([\\w-]+=[0-9.]+)","g")
        for (x = 0; x < linesArray.length; x++) {
            var line = linesArray[x]
            //    var attributes = line.match(attrregex)
            //    line = line.replace(attrregex,"")
            var open = line.match(openregex)
            if (open != null) {
                line = line.replace(openregex, "")
                var opentext = open[0].match(/[A-Za-z0-9_-]+/g)
                stack.push({ tagname: opentext[0], line: (x + 1) })
                //stack.push(opentext[0])
            }

            var close = line.match(closeregex)
            if (close != null) {
                var closetext = close[0].match(/[A-Za-z0-9_-]+/g)
                if (closetext == null) {
                    stack.pop()
                } else if (closetext == stack[stack.length - 1].tagname) {
                    stack.pop()
                } else {
                    var tag = stack.pop()
                    //return { valid: false, msg: "An unclosed tag <"+ tag.tagname +"> at line number "+ tag.line}
                    return { valid: false, msg: "Invalid closing tag </" + closetext + "> at line number " + (x + 1) }
                }
            }
        }
        if (stack.length == 0) {
            return { valid: true, msg: "This is a valid XML document" }
        } else {
            return { valid: false, msg: "Invalid XML document, Unclose tag <" + stack.pop().tagname + ">" }
        }
    },
    RefineAndSplitXML: function (inputText) {
        var tagsregex = new RegExp("(<[^>]*>)", "g")
        var tags = inputText.match(tagsregex)
        if (tags != null) {
            var refined = inputText
            var tag;
            for (var i = 0; i < tags.length; i++) {
                refined = refined.replace(new RegExp(tags[i],"g"), '\n' + tags[i] + '\n')
            }
            var splitted = refined.split(/\r?\n/g);
        }
        var trimmed = new Array()
        var line = ""
        for (var j = 0; j<splitted.length;j++){
            line = splitted[j].trim();
            if(line.length > 0){
                trimmed.push(line)
            }
        }
        return trimmed;
    },
    RefineAndSplitJSON: function (inputText) {

        var refined = inputText
        var embededStr = "EMBEDEDJSON"
        var embedregex = new RegExp("\(\"{\)\[\\\\ \":,;_{\\[a-zA-Z0-9\\]}-\]+\(}\"\)", "g")
        var embededValues = refined.match(embedregex);
        var embededStructure = {};
        if (embededValues != null) {
            for (var x = 0; x < embededValues.length; x++) {
                embededStructure.key = embededStr + x;
                embededStructure.value = embededValues[x];
                refined = refined.replace(embededValues[x], embededStr + x)
            }
        }
        var anchors = ["{", "}", "\\[", "\\]", ";", ","]
        var regex;

        for (var i = 0; i < anchors.length; i++) {
            regex = new RegExp(anchors[i], "g");
            refined = refined.replace(regex, '\n' + anchors[i].replace(/\\/g, "") + '\n')
        }
        if (embededValues != null) {
            for (var x = 0; x < embededValues.length; x++) {
                refined = refined.replace(embededStr + x, embededValues[x])
            }
        }
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