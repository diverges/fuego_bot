import { BaseCommand } from '../baseCommand';
import { Message } from 'discord.js';

export default class Wrong extends BaseCommand {
    public getName(): string {
        return "bro";
    }

    public onCallback(payload: Message): void {
        payload.reply('bro, chill with the bro');
    }
}
