import * as Discord from "discord.js";
import Load from "./load.js";
import Dispatcher from "./dispatcher.js";

// commands
import Ping from "./commands/ping";
import Wrong from "./commands/wrong.js";
import GetTurkey from "./intent/get_turkey";
import Sue from "./commands/sue";

let running: boolean = false;

class App {
    private client: Discord.Client;
    private dispatcher: Dispatcher;
    private config: any;

    constructor() {
        this.client = new Discord.Client();
        this.config = Load.getConfig();
        // Uncomment for debugging purposes only!
        // console.log(this.config);

        this.initDispatcher();

        // Log our bot in
        this.login();
    }

    login() {
        if (this.config.init["discord_token"]) {
            console.log("Logging client in...");
            this.client.login(this.config.init["discord_token"]).then((message) => {
                running = true;
            }).catch((error) => {
                console.log("Login error: " + error);
                this.exit();
            });
        } else {
            console.log("Missing discord_token");
            this.exit();
        }
    }

    exit(): void {
        if (module.exports.abort) {
            process.abort();
        }
        process.exit(0);
    }

    initDispatcher(): void {
        this.dispatcher = new Dispatcher(this.client, this.config);

        // commands
        this.dispatcher.addCommand(new Ping());
        this.dispatcher.addCommand(new Wrong());
        this.dispatcher.addCommand(new Sue());

        // wit.ai
        this.dispatcher.addCommand(new GetTurkey());
    }

    onExit(): void {
        console.log("App closing...");
        if (running) {
            running = false;
            console.log("Closing client...");
            this.client.destroy().then(function () {
                console.log("Client closed!");
                process.exit();
            });
        }
    }
}

const MainApp: App = new App();

process.on("SIGINT", () => MainApp.onExit());

export default MainApp;