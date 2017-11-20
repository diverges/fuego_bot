
// discord.js
const Discord = require('discord.js');
const client = new Discord.Client();

// load settings
const load = require('./src/load.js');
load.loadConfig();

console.log(load.config);

const dispatcher = require('./src/dispatcher.js');
const dispatcherInstance = new dispatcher(client, load.config);

// commands
const ping = require('./src/commands/ping.js');
const bro = require('./src/commands/bro.js');
const wrong = require('./src/commands/wrong.js');

// Setup listeners
client.on('ready', () => {
    ping(client, dispatcherInstance);
	bro(client, dispatcherInstance);
	wrong(client, dispatcherInstance);
    console.log('I am ready!');
});

// Log our bot in
if(process && process.env && process.env.TOKEN)
{
	client.login(process.env.TOKEN);
	console.log('Production Env Loaded...\n');
} else {
	client.login(load.config.init['token']);
}

var running = true;

// Handle app reload
process.on('SIGINT', function() {
    console.log('sigint received...');
    if(running)
    {
        running = false;
        client.destroy();
        console.log('Cleanup finished');
    }
    process.exit();
});
