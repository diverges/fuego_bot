import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { DiscordModule } from 'discord-nestjs'
import { TasksModule } from '../tasks/tasks.module'
import { BotGateway } from './bot.gateway'
import { BotService } from './bot.service'
import { AddFeedCommandHandler } from './commands/add-feed.command'
import { GetTurkeyCommandHandler } from './commands/get-turkey.command'
import { MediaReactCommandHandler } from './commands/media-react.command'
import { PingCommandHandler } from './commands/ping.command'
import { SueCommandHandler } from './commands/sue.command'
import { WakeUpCommandHandler } from './commands/wake-up.command'
import { WrongCommandHandler } from './commands/wrong.command'
import { DiscordConfigService } from './discord-config-service'
import { OnMessageEventHandler } from './events/on-message.event'
import { ChannelQueryHandler } from './queries/channel.query'
import { BotSagas } from './sagas/bot.sagas'

const CommandHandlers = [
    WrongCommandHandler,
    PingCommandHandler,
    SueCommandHandler,
    AddFeedCommandHandler,
    GetTurkeyCommandHandler,
    WakeUpCommandHandler,
    MediaReactCommandHandler
]
const QueryHandlers = [ChannelQueryHandler]
const EventHandlers = [OnMessageEventHandler]

@Module({
    imports: [
        CqrsModule,
        TasksModule,
        DiscordModule.forRootAsync({
            inject: [ConfigService],
            useClass: DiscordConfigService
        })
    ],
    providers: [BotGateway, BotService, ...QueryHandlers, ...CommandHandlers, ...EventHandlers, BotSagas],
    exports: [BotService]
})
export class BotModule {}
