import * as EventEmitter from 'events';
import * as Discord from 'discord.js';
import { Wit } from 'node-wit'; // Wit.ai
import { BaseCommand } from './baseCommand';

export default class CommandDispatcher extends EventEmitter {
    private client : any;
    private witAi : Wit;

    constructor(client : Discord.Client, config : any) {
        super();
        this.client = client;
        this.witAi = (config.init['wit_token']) ? new Wit({ accessToken: config.init['wit_token']}) : undefined;

        client.on('message', (message : Discord.Message) => {
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
            else if (this.witAi && message.mentions && message.mentions.users.has(client.user.id ))
            {
                // bot was mentioned, send to wit.ai and emit intent
                this.witAi.message(message.content, {})
                .then((data) => {
                    if(data.entities && data.entities.intent)
                    {
                        this.emit(data.entities.intent[0].value, message);
                        console.log('message intent: ' + data.entities.intent[0].value);
                    }
                })
            } else if (message.embeds.length > 0) {
                for (const msg of message.embeds) {
                    msg.message.react('🔥').then((value) => value.message.react('🍆'))
                }
            } else if (message.attachments.array().length > 0) {
                message.attachments.map((value) => {
                    value.message.react('🔥').then((v) => v.message.react('🍆'))
                })
            }
        });
    }

    public addCommand(command : BaseCommand) : void {
        this.on(command.getName(), command.onCallback);
    }
}