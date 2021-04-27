import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RssFeedCommandHandler } from './commands/rss-feed.command'
import { Feed } from './entities/feed.entity'
import { RssFeedQueryHandler } from './queries/rss-feed.query'
import { TasksService } from './tasks.service'

const CommandHandlers = [RssFeedCommandHandler]
const QueryHandler = [RssFeedQueryHandler]

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([Feed])],
    providers: [TasksService, ...CommandHandlers, ...QueryHandler],
    exports: [TasksService]
})
export class TasksModule {}
