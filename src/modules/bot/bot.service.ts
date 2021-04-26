import { Injectable, Logger } from '@nestjs/common'
import { DiscordClientProvider } from 'discord-nestjs'
import { Channel } from 'discord.js'

@Injectable()
export class BotService {
    private readonly logger = new Logger(BotService.name)

    constructor(private readonly discordProvider: DiscordClientProvider) {}

    public getChannelById(id: string): Channel | undefined {
        return this.discordProvider.getClient().channels.cache.find((channel) => channel.id === id)
    }
}
