import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Feed } from 'src/modules/tasks/entities/feed.entity'
import { TasksModule } from 'src/modules/tasks/tasks.module'
import { WitModule } from 'src/modules/wit/wit.module'
import { BotModule } from '../modules/bot/bot.module'

const featureModules = [BotModule, TasksModule, WitModule]

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        ScheduleModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'fuego.db',
            entities: [Feed],
            synchronize: true
        }),
        ...featureModules
    ]
})
export class AppModule {}
