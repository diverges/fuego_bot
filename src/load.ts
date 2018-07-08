import * as fs from "fs";
const configDir = "config/";
const cmdDir = "src/commands/";

export default class Load {
    public static getConfig() {
        const config = Load.loadConfig();

        // overwrite config with prod settings
        if (config._prod_init !== undefined) {
            config.init = config._prod_init;
        }
        return config;
    }

    // Loads all files in config/ folder as JS objects
    // for easy referencing.
    private static loadConfig(): any {
        const getFileStr = (name: string) => name.substr(0, name.indexOf("."));
        const filenames = fs.readdirSync(configDir);
        const commandNames = fs.readdirSync(cmdDir);
        const data: any = {
            commands: commandNames.map(getFileStr)
        };
        filenames.forEach(function (filename) {
            if (filename.indexOf(".default") === -1) {
                const id = getFileStr(filename);
                const buffer = fs.readFileSync(configDir + filename, "utf-8");
                data[id] = Load.fileToObj(buffer);
            }
        });
        return data;
    }

    private static fileToObj(buffer: string): any {
        const ret: any = {};
        const split = buffer.split(/(?:\r\n|\r|\n)/g);

        split.forEach(function (line: string) {
            const index = line.indexOf("=");
            if (!line.startsWith("#") && index > 0) {
                ret[line.substr(0, index)] = line.substr(index + 1);
            }
        });

        return ret;
    }
}