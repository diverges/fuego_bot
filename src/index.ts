import * as Discord from 'discord.js';
import Load from './load.js';
import { Dispatcher } from './dispatcher.js';

// commands
import { Ping, Wrong, Sue } from './commands';
import { GetTurkey } from './intent';
import { Config } from './config.js';
import { CommandResolver, WitAiResolver, MediaVotingResolver } from './resolver/index.js';

let running: boolean = false;
Config.Instance = Load.loadConfig();

class App {
    private client: Discord.Client;
    private dispatcher: Dispatcher;

    constructor() {
        this.client = new Discord.Client();
    }

    public async login(): Promise<void> {
        if (!Config.Instance.init['discord_token']) {
            throw new Error('Discord token in config/init must be defined.');
        }

        // Dispatcher
        this.initDispatcher();

        // Login
        console.log('Logging client in...');
        await this.client.login(Config.Instance.init['discord_token']);

        // Events
        this.client.on('message', this.dispatcher.onMessage.bind(this.dispatcher));
    }

    initDispatcher(): void {
        this.dispatcher = new Dispatcher(this.client);

        // message resolvers
        this.dispatcher.addResolver(new CommandResolver(this.dispatcher));
        this.dispatcher.addResolver(new WitAiResolver(this.dispatcher));
        this.dispatcher.addResolver(new MediaVotingResolver());

        // commands
        this.dispatcher.addCommand(new Ping());
        this.dispatcher.addCommand(new Wrong());
        this.dispatcher.addCommand(new Sue());

        // wit.ai
        this.dispatcher.addCommand(new GetTurkey());
    }

    onExit(): void {
        if (running) {
            running = false;
            this.client.destroy().then(function () {
                process.exit();
            });
        }
    }
}

const MainApp: App = new App();

process.on('SIGINT', () => MainApp.onExit());

MainApp.login()
    .then( () => { running = true; })
    .catch(error => {
        console.log(error);
        this.exit();
    });

export default MainApp;