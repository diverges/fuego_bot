import { InMemoryDBService } from '@nestjs-addons/in-memory-db'
import { Logger } from '@nestjs/common'
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Message } from 'discord.js'
import { PostFactorioCommand } from 'src/modules/tasks/commands/post-factorio.command'
import { FeedEntity } from '../entities/feed.interface'

export class AddFeedCommand {
    constructor(public readonly content: string, public readonly context: Message) {}
}

@CommandHandler(AddFeedCommand)
export class AddFeedCommandHandler implements ICommandHandler<AddFeedCommand> {
    private readonly logger = new Logger(AddFeedCommandHandler.name)

    constructor(private readonly feedService: InMemoryDBService<FeedEntity>, private readonly commandBus: CommandBus) {}

    async execute(command: AddFeedCommand) {
        if (command.content === 'now') {
            await this.commandBus.execute(new PostFactorioCommand(true))
            return
        }
        if (command.content === 'clean') {
            this.feedService.deleteMany(this.feedService.getAll().map((x) => x.id))
            command.context.reply('All feeds have been cleaned.')
        }
        const data = this.feedService.query((record) => record.type === command.content)
        if (data.length > 0) {
            command.context.reply(JSON.stringify(data))
            return
        }
        this.feedService.create({ channelId: command.context.channel.id, type: command.content })
    }
}
