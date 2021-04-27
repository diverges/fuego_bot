import { Injectable, Logger } from '@nestjs/common'
import { CommandBus, EventBus } from '@nestjs/cqrs'
import { Content, Context, DiscordClientProvider, On, Once, OnCommand } from 'discord-nestjs'
import { Message } from 'discord.js'
import { AddFeedCommand } from './commands/add-feed.command'
// import { GetTurkeyCommand } from './commands/get-turkey.command'
import { PingCommand } from './commands/ping.command'
import { SueCommand } from './commands/sue.command'
import { WakeUpCommand } from './commands/wake-up.command'
import { WrongCommand } from './commands/wrong.command'
import { OnMessageEvent } from './events/on-message.event'

@Injectable()
export class BotGateway {
    private readonly logger = new Logger(BotGateway.name)

    constructor(private commandBus: CommandBus, private readonly discordProvider: DiscordClientProvider, private readonly eventBus: EventBus) {}

    @Once({ event: 'ready' })
    onReady(): void {
        this.logger.log(`Logged in as ${this.discordProvider.getClient().user?.tag ?? 'fuego'}!`)
    }

    @OnCommand({ name: 'wrong' })
    async onWrong(@Content() content: string, @Context() [context]: [Message]): Promise<void> {
        return this.commandBus.execute(new WrongCommand(content, context))
    }

    @OnCommand({ name: 'sue' })
    async onsue(@Content() content: string, @Context() [context]: [Message]): Promise<void> {
        return this.commandBus.execute(new SueCommand(content, context))
    }

    @OnCommand({ name: 'ping' })
    async onPing(@Content() content: string, @Context() [context]: [Message]): Promise<void> {
        return this.commandBus.execute(new PingCommand(content, context))
    }

    @OnCommand({ name: 'add-feed' })
    async onSue(@Content() content: string, @Context() [context]: [Message]): Promise<void> {
        return this.commandBus.execute(new AddFeedCommand(content, context))
    }

    @OnCommand({ name: 'wake-up' })
    async onWakeUp(@Content() content: string, @Context() [context]: [Message]): Promise<void> {
        return this.commandBus.execute(new WakeUpCommand(content, context))
    }

    @On({ event: 'message' })
    async onMessage(message: Message): Promise<void> {
        if (message.author.bot) return
        this.eventBus.publish(new OnMessageEvent(message))
    }

    @On({ event: 'emojiUpdate' })
    async onEmojiUpdate(oldEmoji: any, newEmoji: any): Promise<void> {
        console.log(oldEmoji, newEmoji)
    }
}
