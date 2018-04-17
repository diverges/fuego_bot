import * as Discord from 'discord.js';
import Load from './src/load.js';
import Dispatcher from './src/dispatcher.js';

// commands
import Ping from './src/commands/ping';
import Bro from './src/commands/bro.js';
import Wrong from './src/commands/wrong.js';
import GetTurkey from './src/intent/get_turkey';
import Sue from './src/commands/sue';

let Running : boolean = false;

class App {
    private client : Discord.Client;
    private dispatcher : Dispatcher;
    private config : any;

    constructor() {
        this.client = new Discord.Client();
        this.config = Load.getConfig();
        console.log(this.config)

        this.initDispatcher();
        // Log our bot in
        Running = true;
        this.client.login(this.config.init['discord_token']);
        console.log('Client logged in...');
    }

    initDispatcher() : void {
        this.dispatcher = new Dispatcher(this.client, this.config);

        // commands
        this.dispatcher.addCommand(new Ping());
        this.dispatcher.addCommand(new Bro());
        this.dispatcher.addCommand(new Wrong());
        this.dispatcher.addCommand(new Sue());

        // wit.ai
        this.dispatcher.addCommand(new GetTurkey())
    }

    onExit () : void {
        console.log('App closing...');
        if(Running)
        {
            Running = false;
            console.log('Closing client...');
            this.client.destroy().then(function()
            {
                console.log('App exit!');
                process.exit()
            });
        }
    }
}

let MainApp : App = new App();

process.on('SIGINT', () => MainApp.onExit());

export default MainApp;