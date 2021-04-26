import { InMemoryDBService } from '@nestjs-addons/in-memory-db'
import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs'
import { TextChannel } from 'discord.js'
import { FeedEntity } from 'src/modules/bot/entities/feed.interface'
import { BotService } from '../../bot/bot.service'
import { AltFactorioPost, AltFactorioQuery } from '../queries/alt-factorio.query'

export class PostFactorioCommand {
    constructor(public readonly override: boolean = false) {}
}

@CommandHandler(PostFactorioCommand)
export class PostFactorioCommandHandler implements ICommandHandler<PostFactorioCommand> {
    private readonly logger = new Logger(PostFactorioCommandHandler.name)

    constructor(private readonly queryBus: QueryBus, private readonly feedService: InMemoryDBService<FeedEntity>, private readonly botService: BotService) {}

    async execute(command: PostFactorioCommand) {
        const post: AltFactorioPost = await this.queryBus.execute(new AltFactorioQuery())

        const data = this.feedService.query((record) => record.type === 'factorio')
        if (data.length === 0) {
            return
        }
        const channel = this.botService.getChannelById(data[0].channelId) as TextChannel
        if (!channel) {
            return
        }
        const lastMessages = await channel.messages.fetch({ limit: 10 })
        if (lastMessages.filter((message) => message.content.includes(post.link)).size > 0 && !command.override) {
            return
        }
        await channel.send(post.link)
    }
}
