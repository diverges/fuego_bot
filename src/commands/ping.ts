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
            for (const ps of names) {
                if (payload.cleanContent.indexOf(ps[0]) > -1) {
                    replies.push(channel.send('suck it!', { reply: ps[1] }));
                }
            }
            if (replies.length === 0) {
                payload.reply('suck it!');
            }
            Promise.all(replies).catch((error: Error) => console.log(error));
        } else {
            payload.reply('suck it!');
        }
    }
}