import { Message } from 'discord.js';

export abstract class BaseCommand {
    public abstract getName() : string;
    public abstract onCallback(payload : Message) : void;
}