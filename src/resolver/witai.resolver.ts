import { EventEmitter } from 'events';
import { Resolver, Client, Message } from './resolver';
import { Config } from './../config.js';
import { Wit, MessageResponse } from 'node-wit';

export class WitAiResolver extends EventEmitter implements Resolver {
    private witAi: Wit;

    constructor() {
        super();
        const config = Config.Instance;
        if (config && config.init) {
            this.witAi = (config.init['wit_token']) ? new Wit({ accessToken: config.init['wit_token'] }) : undefined;
        }
    }

    onInit(client: Client): boolean {
        return true;
    }

    isActive(message: Message): boolean {
        return this.witAi
            && message.mentions
            && message.mentions.users.has(message.client.user.id);
    }

    async onMessage(message: Message): Promise<void> {
        // bot was mentioned, send to wit.ai and emit intent
        const data: MessageResponse = await this.witAi.message(message.content, {});
        if (data.entities && data.entities.intent) {
            this.emit(data.entities.intent[0].value, message);
            console.log('message intent: ' + data.entities.intent[0].value);
        }
    }

}