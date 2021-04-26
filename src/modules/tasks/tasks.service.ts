import { Injectable, Logger } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Cron } from '@nestjs/schedule'
import { PostFactorioCommand } from './commands/post-factorio.command'

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name)

    constructor(private readonly commandBus: CommandBus) {}

    @Cron('0 * * * *')
    async handleCron() {
        await this.commandBus.execute(new PostFactorioCommand())
    }
}
