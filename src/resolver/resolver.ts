import * as Discord from 'discord.js';

export type Client = Discord.Client;
export type Message = Discord.Message;

// Resolver :
//  Discord message resolvers operate on a message when isActive condition
//  is met.
export interface Resolver {
    // onInit:
    //  Initialize resolver, can bind to events here.
    //  Returns true on success.
    onInit(client: Client): boolean;

    // isActive:
    //  Condition for onMessage to run.
    isActive(message: Message): boolean;

    // onMessage:
    //  Handle message.
    onMessage(message: Message): Promise<void>;
}