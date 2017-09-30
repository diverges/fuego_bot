const fs = require('fs');
const configDir = 'config/';
const cmdDir = 'src/commands/';

function FileToObj(buffer) {
    var ret = {};
    var split = buffer.split(/(?:\r\n|\r|\n)/g);

    split.forEach(function(line) {
        var index = line.indexOf('=');
        if( !line.startsWith('#') && index > 0) {
            ret[line.substr(0, index)] = line.substr(index+1);
        }
    });

    return ret;
}

// Loads all files in config/ folder as JS objects
// for easy referencing.
var load = {
    config : {},

    loadConfig : function() {
        var getFileStr = name => name.substr(0, name.indexOf('.'));
        var filenames = fs.readdirSync(configDir);
        var commandNames = fs.readdirSync(cmdDir);
        var data = {
            commands : commandNames.map(getFileStr)
        };

        filenames.forEach(function(filename) {
            var id = getFileStr(filename);
            var buffer = fs.readFileSync(configDir + filename, 'utf-8');
            data[id] = FileToObj(buffer);
        });
        this.config = data;
    }
}

module.exports = load;
