import * as fs from 'fs';
const configDir = 'config/';
const cmdDir = 'src/commands/';

export default class Load {

    public static getConfig() {
        var config = this.loadConfig();

        // overwrite config with prod settings
        if(config._prod_init !== undefined)
        {
            config.init = config._prod_init;
        }
        return config;
    }

    // Loads all files in config/ folder as JS objects
    // for easy referencing.    
    private static loadConfig() : any {
        const getFileStr  = (name) => name.substr(0, name.indexOf('.'));
        var filenames = fs.readdirSync(configDir);
        var commandNames = fs.readdirSync(cmdDir);
        var data = {
            commands : commandNames.map(getFileStr)
        };
        filenames.forEach(function(filename) {
            var id = getFileStr(filename);
            var buffer = fs.readFileSync(configDir + filename, 'utf-8');
            data[id] = Load.fileToObj(buffer);
        });
        return data;
    }

    private static fileToObj(buffer) : any {
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
} 