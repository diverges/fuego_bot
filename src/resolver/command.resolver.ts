import { EventEmitter } from 'events';
import { Resolver, Client, Message } from './resolver';
import { Config } from './../config.js';
import { Dispatcher } from '../dispatcher';

export class CommandResolver extends EventEmitter implements Resolver {
    private readonly dispatcher: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        super();
        this.dispatcher = dispatcher;
    }

    onInit(client: Client): boolean {
        return true;
    }

    isActive(message: Message): boolean {
        return message.content.startsWith(Config.Instance.init['cmd_token']);
    }

    async onMessage(message: Message): Promise<void> {
        const command = message.content.substring(1).split(' ')[0];

        if (Config.Instance.commands.indexOf(command) >= 0) {
            this.dispatcher.emit(command, message);
        }
    }

}