import { InMemoryDBModule } from '@nestjs-addons/in-memory-db'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { BotModule } from '../bot/bot.module'
import { PostFactorioCommandHandler } from './commands/post-factorio.command'
import { AltFactorioQueryHandler } from './queries/alt-factorio.query'
import { TasksService } from './tasks.service'

const CommandHandlers = [PostFactorioCommandHandler]
const EventHandlers = [AltFactorioQueryHandler]

@Module({
    imports: [CqrsModule, InMemoryDBModule, BotModule],
    providers: [TasksService, ...EventHandlers, ...CommandHandlers]
})
export class TasksModule {}
