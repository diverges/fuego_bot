import { InMemoryDBModule } from '@nestjs-addons/in-memory-db'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
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
        InMemoryDBModule,
        ...featureModules
    ]
})
export class AppModule {}
