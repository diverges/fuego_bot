import * as Discord from 'discord.js';

export type Client = Discord.Client;
export type Message = Discord.Message;

export interface Resolver {
    isActive(message: Message): boolean;
    onInit(client: Client): boolean;
    onMessage(message: Message): Promise<void>;
}