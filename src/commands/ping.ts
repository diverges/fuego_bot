import { BaseCommand } from '../baseCommand';
import { TextChannel, Message, GuildMember } from 'discord.js';

export class Ping extends BaseCommand {
    public getName(): string {
        return 'ping';
    }

    public onCallback(payload: Message): void {
        const args = payload.content.split(' ');
        if (args.length > 1) {
            const channel = payload.channel as TextChannel;
            const names: Map<string, GuildMember> = new Map<string, GuildMember>();
            for (const member of channel.members.array()) {
                names.set(member.displayName, member);
            }
            const replies: Array<Promise<Message| Message[]>> = [];
            names.forEach((value, key) => {
                if (payload.cleanContent.indexOf(key) > -1) {
                    replies.push(payload.reply('suck it!', { reply: value }));
                }
            });
            Promise.all(replies);
        } else {
            payload.reply('suck it');
        }
    }
}