import { BaseCommand } from '../baseCommand';
import { TextChannel, Message } from 'discord.js';

export default class Ping extends BaseCommand {
    public getName(): string {
        return 'ping';
    }

    public onCallback(payload: Message): void {
        const args = payload.content.split(' ');
        if (args.length > 1) {
            const name = args.slice(1, args.length).join(' ');
            const channel = payload.channel as TextChannel;
            if (channel.members) {
                const user = channel.members.find('displayName', name);
                payload.channel.send(' suck it!', { reply: user });
            }
        } else {
            payload.reply('suck it');
        }
    }
}