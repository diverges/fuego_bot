import * as EventEmitter from 'events';
import { Client, Message } from 'discord.js';
import { BaseCommand } from './baseCommand';
import { Config } from './config';
import { Resolver } from './resolver';

export class Dispatcher extends EventEmitter {
    private client: Client;
    private resolvers: Resolver[];
    private readonly config: any;

    constructor(client: Client) {
        super();
        this.config = Config.Instance;
        this.client = client;
        this.resolvers = [];
    }

    public async onMessage (message: Message): Promise<void> {
        // Ignore messages from bots
        if (message.author.bot) return;

        this.resolvers.forEach(resolver => {
            if (resolver.isActive(message)) {
                resolver.onMessage(message);
            }
        });
    }

    public addResolver(resolver: Resolver): void {
        if (resolver.onInit(this.client)) {
            this.resolvers.push(resolver);
        }
    }

    public addCommand(command: BaseCommand): void {
        this.on(command.getName(), command.onCallback);
    }
}