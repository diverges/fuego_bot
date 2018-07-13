import * as fs from 'fs';
const configDir = 'config/';
const cmdDir = 'src/commands/';

export default class Load {
    // Loads all files in config/ folder as JS objects
    // for easy referencing.
    public static loadConfig(): any {
        const getFileStr = (name: string) => name.substr(0, name.indexOf('.'));
        const filenames = fs.readdirSync(configDir);
        const commandNames = fs.readdirSync(cmdDir).filter(elem => elem != 'index');
        const data: any = {
            commands: commandNames.map(getFileStr)
        };
        filenames.forEach(function (filename) {
            const id = getFileStr(filename);
            const buffer = fs.readFileSync(configDir + filename, 'utf-8');
            data[id] = Load.fileToObj(buffer);
        });
        return data;
    }

    private static fileToObj(buffer: string): any {
        const ret: any = {};
        const split = buffer.split(/(?:\r\n|\r|\n)/g);

        split.forEach(function (line: string) {
            const index = line.indexOf('=');
            if (!line.startsWith('#') && index > 0) {
                ret[line.substr(0, index)] = line.substr(index + 1);
            }
        });

        return ret;
    }
}