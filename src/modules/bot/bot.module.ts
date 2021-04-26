import { InMemoryDBModule } from '@nestjs-addons/in-memory-db'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordModule } from 'discord-nestjs'
import { BotGateway } from './bot.gateway'
import { BotService } from './bot.service'
import { AddFeedCommandHandler } from './commands/add-feed.command'
import { GetTurkeyCommandHandler } from './commands/get-turkey.command'
import { PingCommandHandler } from './commands/ping.command'
import { SueCommandHandler } from './commands/sue.command'
import { WakeUpCommandHandler } from './commands/wake-up.command'
import { WrongCommandHandler } from './commands/wrong.command'
import { DiscordConfigService } from './discord-config-service'
import { OnMessageEventHandler } from './events/on-message.event'
import { BotSagas } from './sagas/bot.sagas'

const CommandHandlers = [WrongCommandHandler, PingCommandHandler, SueCommandHandler, AddFeedCommandHandler, GetTurkeyCommandHandler, WakeUpCommandHandler]
const EventHandlers = [OnMessageEventHandler]

@Module({
    imports: [
        CqrsModule,
        InMemoryDBModule,
        DiscordModule.forRootAsync({
            inject: [ConfigService],
            useClass: DiscordConfigService
        })
    ],
    providers: [BotGateway, BotService, ...CommandHandlers, ...EventHandlers, BotSagas],
    exports: [BotService]
})
export class BotModule {}
