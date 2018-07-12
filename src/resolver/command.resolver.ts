import { EventEmitter } from 'events';
import { Resolver, Client, Message } from './resolver';
import { Config } from './../config.js';


export class CommandResolver extends EventEmitter implements Resolver {

    onInit(client: Client): boolean {
        return true;
    }

    isActive(message: Message): boolean {
        return message.content.startsWith(Config.Instance.init['cmd_token']);
    }

    async onMessage(message: Message): Promise<void> {
        const command = message.content.substring(1).split(' ')[0];
        if (Config.Instance.init['cmd_token'].commands.indexOf(command) >= 0) {
            this.emit(command, message);
        }
    }

}