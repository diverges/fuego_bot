import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Channel } from 'discord.js'
import { BotService } from '../bot.service'

export class ChannelQuery {
    constructor(public readonly id: string) {}
}

@QueryHandler(ChannelQuery)
export class ChannelQueryHandler implements IQueryHandler<ChannelQuery> {
    constructor(private botService: BotService) {}

    async execute(query: ChannelQuery): Promise<Channel | undefined> {
        return this.botService.getChannelById(query.id)
    }
}
