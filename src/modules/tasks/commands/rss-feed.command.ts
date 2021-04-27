import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs'
import { Channel, TextChannel } from 'discord.js'
import { ChannelQuery } from 'src/modules/bot/queries/channel.query'
import { RssFeedEntry, RssFeedQuery } from '../queries/rss-feed.query'
import { TasksService } from '../tasks.service'

export class RssFeedCommand {
    constructor(public readonly type: string | undefined = undefined, public readonly override: boolean = false) {}
}

@CommandHandler(RssFeedCommand)
export class RssFeedCommandHandler implements ICommandHandler<RssFeedCommand> {
    private readonly logger = new Logger(RssFeedCommandHandler.name)

    constructor(private readonly tasksService: TasksService, private readonly queryBus: QueryBus) {}

    async execute(command: RssFeedCommand) {
        const feeds = command.type ? await this.tasksService.findAllByType(command.type) : await this.tasksService.findAll()
        feeds.forEach(async (feed) => {
            try {
                const channel = (await this.queryBus.execute<ChannelQuery, Channel | undefined>(new ChannelQuery(feed.channelId))) as TextChannel | undefined
                if (!channel) throw new Error('channel does not exists!')
                const lastMessages = await channel.messages.fetch({ limit: 10 })
                const posts = await this.queryBus.execute<RssFeedQuery, RssFeedEntry[]>(new RssFeedQuery(feed.url))
                if (!posts || !posts.length) return
                if (lastMessages.filter((messsage) => messsage.content.includes(posts[0].link)).size > 0 && !command.override) return
                await channel.send(posts[0].link)
            } catch (error) {
                this.logger.error(error.message)
            }
        })
    }
}
