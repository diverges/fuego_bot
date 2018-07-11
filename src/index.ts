import * as Discord from 'discord.js';
import Load from './load.js';
import Dispatcher from './dispatcher.js';

// commands
import { Ping, Wrong, Sue } from './commands';
import { GetTurkey } from './intent';
import { Config } from './config.js';

let running: boolean = false;
Config.Instance = Load.getConfig();

class App {
    private client: Discord.Client;
    private dispatcher: Dispatcher;
    private config: any;

    constructor() {
        this.client = new Discord.Client();
        this.config = Config.Instance;
    }

    public async login(): Promise<void> {
        if (!this.config.init['discord_token']) {
            throw new Error('Discord token in config/init must be defined.');
        }

        // Dispatcher
        this.initDispatcher();

        // Login
        console.log('Logging client in...');
        await this.client.login(this.config.init['discord_token']);

        // Events
        this.client.on('message', this.dispatcher.onMessage.bind(this.dispatcher));
        running = true;
    }

    initDispatcher(): void {
        this.dispatcher = new Dispatcher(this.config);

        // commands
        this.dispatcher.addCommand(new Ping());
        this.dispatcher.addCommand(new Wrong());
        this.dispatcher.addCommand(new Sue());

        // wit.ai
        this.dispatcher.addCommand(new GetTurkey());
    }

    onExit(): void {
        console.log('App closing...');
        if (running) {
            running = false;
            console.log('Closing client...');
            this.client.destroy().then(function () {
                console.log('Client closed!');
                process.exit();
            });
        }
    }
}

const MainApp: App = new App();

process.on('SIGINT', () => MainApp.onExit());

MainApp.login().catch(error => {
    console.log(error);
    this.exit();
});

export default MainApp;