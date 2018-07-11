import { EventEmitter } from 'events';
import { DiscordMessageResolver, Client, Message } from './base.resolver';
import { Config } from './../config.js';


export class CommandResolver extends EventEmitter implements DiscordMessageResolver {

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