//mostly a note as of right now. The idea is to take sloppy input and create a regex that can potentially
// fint the right word you meant to say if given a dicitonary
//works by knowing the keyboard layout and what buttons could accidently be hit
var keys = {
    'natural': ['`1234567890-=', '	qwertyuiop[]\\', 'asdfghjkl;\'', 'zxcvbnm,./'],
    'shift': ['~!@#$%^&*()_+', '	QWERTYUIOP{}|', 'ASDFGHJKL:"', 'ZXCVBNM<>?'],
}
var natural = keys.natural
var shift = keys.shift
var shiftProtection = true
//untested
var fatFingerProtection = true
var lazyFingerProection = false //not implemtned always false
var map = {}
var keyChar, shiftChar, normalTypos, shiftTypos;
var isUpperRegEx = /^[A-Z]*$/
if (shiftProtection) {
    normalTypos = shiftTypos = []
} else {
    normalTypos = [] shiftTypos = []
}
for (var irow = 0; irow < natural.length; irow++) {
    for (var i = 0; i < natural[irow].length; i++) {
        var keyChar = natural[irow][i];
        var shiftChar = shift[irow][i];
        normalTypos.length = shiftTypos.length = 0
        if (!fatFingerProtection) {
            addRow(irow, i, 1);
        } else {
            addRow(irow, i - 1, 3);
            switch (irow) {
                case 0:
                    addRow(irow + 1, i - 1, 3);
                    break;
                case 1:
                    addRow(irow - 1, i - 1, 3) addRow(irow + 1, i - 2, 3) break;
                case 2:
                    addRow(irow - 1, i, 3) addRow(irow + 1, i - 1, 3) break;
                case 3:
                    addRow(irow - 1, i, 2) break;
                default:
                    throw "Error with this keyboard layout"
                    break;
            }
        }
        map[keyChar] = map[shiftChar] = new RegExp(normalTypos.join('').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // $& means the whole matched string 	
        if (!shiftProtection) {
            map[shiftChar] = new RegExp(shiftTypos.join('').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        }
    }
}

function addRow(rowIndex, leftIndex, n) {
    var naturalRow = natural[rowIndex]
    var shiftRow = shift[rowIndex]
    for (var i = leftIndex; i < leftIndex + n; i++) {
        char = naturalRow[i]
        if (!char) {
            continue;
        }
        normalTypos.push(char);
        char = shiftRow[i];
        if (!shiftProtection || !isUpperRegEx.test(char)) {
            shiftTypos.push(char);
        }
    }
}
toJSON = function(map) {
    function replacer(key, value) {
        if (value instanceof RegExp) return ("__REGEXP " + value.toString());
        else return value;
    }

    function reviver(key, value) {
        var m = value.match(/\/(.*)\/(.*)?/);
        return new RegExp(m[1], m[2] || "");
    }
    console.log(JSON.parse(JSON.stringify(o, replacer, 2), reviver));
}
toJSONP = function(o) {
    function replacer(key, value) {
        if (value instanceof RegExp) return (value.toString());
        else return value;
    }
    // function reviver(key, value) {
    // 	var m = value.match(/\/(.*)\/(.*)?/);
    // 	return new RegExp(m[1], m[2] || "");
    // }
    var beginnning = /^  \".*?\": \"/ //remove last character)
    var end = /\",$/ //remove first character
    return JSON.stringify(o, replacer, 2).replace('""', '');
}
