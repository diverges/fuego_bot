const EventEmitter = require('events');
// Wit.ai
const WitAi = require('node-wit').Wit;

class CommandDispatcher extends EventEmitter {
    constructor(client, config) {
        super();
        this.client = client;
        this.witAi = (config.init['wit_token']) ? new WitAi({ accessToken: config.init['wit_token']}) : undefined;

        client.on('message', message => {
            
            // Ignore messages from bots
            if(message.author.bot) return;
            
            if(message.content.startsWith(config.init['cmd_token']))
            {
                // basic command eg. /ping
                var command = message.content.substring(1).split(' ')[0];
                if(config.commands.indexOf(command) >= 0) {
                    this.emit(command, message);
                }
            } 
            else if (message.mentions && message.mentions.users.has(client.user.id ))
            {
                // bot was mentioned, send to wit.ai and emit intent
                this.witAi.message(message.content, {})
                .then((data) => {
                    if(data.entities && data.entities.intent)
                    {
                        this.emit(data.entities.intent[0].value, { msg: message, entities: data.entities});
                        console.log('message intent: ' + data.entities.intent[0].value);
                    }
                })
            } 
        });
    }

}

module.exports = CommandDispatcher;
