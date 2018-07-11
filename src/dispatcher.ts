import * as EventEmitter from 'events';
import * as Discord from 'discord.js';
import { Wit, MessageResponse } from 'node-wit'; // Wit.ai
import { BaseCommand } from './baseCommand';

// Guild -> (Upvote, Downvote)
class EmojiCollection {
    [id: string]: {
        Upvote: string, Downvote: string
    }

    static get Default(): { Upvote: string, Downvote: string } {
        return { Upvote: '🔥', Downvote: '🍆'}; // default
    }
}

export default class CommandDispatcher extends EventEmitter {
    private config: any;
    private witAi: Wit;
    private emojiCache: EmojiCollection; // Emoji id's per guild

    constructor(config: any) {
        super();
        this.config = config;
        this.emojiCache = new EmojiCollection();
        if (config && config.init) {
            this.witAi = (config.init['wit_token']) ? new Wit({ accessToken: config.init['wit_token'] }) : undefined;
        }
    }

    public async onMessage (message: Discord.Message): Promise<void> {
        // Ignore messages from bots
        if (message.author.bot) return;

        if (message.content.startsWith(this.config.init['cmd_token'])) {
            // // basic command eg. /ping
            // const command = message.content.substring(1).split(' ')[0];
            // if (this.config.commands.indexOf(command) >= 0) {
            //     this.emit(command, message);
            // }
        }
        else if (this.witAi && message.mentions && message.mentions.users.has(message.client.user.id)) {
            // // bot was mentioned, send to wit.ai and emit intent
            // const data: MessageResponse = await this.witAi.message(message.content, {});
            // if (data.entities && data.entities.intent) {
            //     this.emit(data.entities.intent[0].value, message);
            //     console.log('message intent: ' + data.entities.intent[0].value);
            // }
        } else if (message.embeds.length > 0 || message.attachments.array().length > 0) {
            // return this.sendUpvoteDownvote(message);
        }
    }

    public addCommand(command: BaseCommand): void {
        this.on(command.getName(), command.onCallback);
    }
}