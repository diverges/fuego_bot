import { Logger } from '@nestjs/common'
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Message } from 'discord.js'
import { RssFeedCommand } from 'src/modules/tasks/commands/rss-feed.command'
import { Feed } from 'src/modules/tasks/entities/feed.entity'
import { TasksService } from 'src/modules/tasks/tasks.service'

export class AddFeedCommand {
    constructor(public readonly content: string, public readonly context: Message) {}
}

@CommandHandler(AddFeedCommand)
export class AddFeedCommandHandler implements ICommandHandler<AddFeedCommand> {
    private readonly logger = new Logger(AddFeedCommandHandler.name)

    constructor(private readonly taskService: TasksService, private readonly commandBus: CommandBus) {}

    async execute(command: AddFeedCommand) {
        const args = command.content.split(' ')
        if (args[0] === 'now') {
            return await this.commandBus.execute(new RssFeedCommand(args[1], true))
        }
        if (command.content === 'clean') {
            await this.taskService.removeAll()
            return command.context.reply('All feeds have been cleaned.')
        }
        const type: string[] = command.content.split(' ') ?? ['']
        if (type.length != 2) {
            return command.context.reply('Feed needs type and url')
        }
        const data = await this.taskService.findAllByType(type[0])
        if (data.length > 0) {
            return command.context.reply(JSON.stringify(data))
        }
        const feed = new Feed()
        feed.type = type[0]
        feed.channelId = command.context.channel.id
        feed.url = type[1]
        const entity = await this.taskService.create(feed)
        return command.context.reply(`Feed was created ${JSON.stringify([entity])}`)
    }
}
