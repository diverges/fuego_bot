import { BaseCommand } from '../baseCommand';
import { TextChannel, Message } from 'discord.js';

export default class Ping extends BaseCommand {
    public getName(): string {
        return "ping";
    }

    public onCallback(payload: Message): void {
        var args = payload.content.split(' ');
        if(args.length > 1) {
            var name = args.slice(1, args.length).join(' ');
            let channel = payload.channel as TextChannel;
            if(channel.members) {
                var user = channel.members.find('displayName', name);
                payload.channel.send(' suck it!', {reply : user});
            }
        } else {
            payload.reply('suck it');
        }
    }
}