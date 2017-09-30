const EventEmitter = require('events');

class CommandDispatcher extends EventEmitter {
    constructor(client, config) {
        super();
        this.client = client;

        client.on('message', message => {
            
            // Ignore messages from bots
            if(message.author.bot) return;
            
            if(!message.content.startsWith(config.init['cmd_token'])) return;
            
            var command = message.content.substring(1).split(' ')[0];
            if(config.commands.indexOf(command) >= 0) {
                this.emit(command, message);
            }
        });
    }

}

module.exports = CommandDispatcher;
