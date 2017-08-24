const EventEmitter = require('events');

class CommandDispatcher extends EventEmitter {
    constructor(client, config) {
        super();
        this.client = client;

        client.on('message', message => {
            var index = config.commands.indexOf(message.content);
            if(index >= 0)
                this.emit(config.commands[index], message);
        });
    }

}

module.exports = CommandDispatcher;
