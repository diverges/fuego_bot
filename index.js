// discord.js
const Discord = require('discord.js');
const discordClient = new Discord.Client();

// load settings
const load = require('./src/load.js');
load.loadConfig();

console.log(load.config);

const dispatcher = require('./src/dispatcher.js');
const dispatcherInstance = new dispatcher(discordClient, load.config);

// commands
const ping = require('./src/commands/ping.js');
const bro = require('./src/commands/bro.js');
const get_turkey = require('./src/intent/get_turkey.js');

// Setup listeners
discordClient.on('ready', () => {
    ping(discordClient, dispatcherInstance);
	bro(discordClient, dispatcherInstance);
    get_turkey(discordClient, dispatcherInstance);
    console.log('I am ready!');
});

// Log our bot in
if(process && process.env && process.env.TOKEN)
{
	discordClient.login(process.env.TOKEN);
	console.log('Production Env Loaded...\n');
} else {
	discordClient.login(load.config.init['discord_token']);
}

var running = true;

// Handle app reload
process.on('SIGINT', function() {
    console.log('sigint received...');
    if(running)
    {
        running = false;
        discordClient.destroy().then(function()
        {
            console.log('Cleanup finished');
            process.exit()
        });
    }
});
