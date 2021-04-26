import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { RunWitCommandHandler } from './commands/run-wit.command'
import { WitService } from './wit.service'

const CommandHandlers = [RunWitCommandHandler]

@Module({
    imports: [CqrsModule],
    providers: [WitService, ...CommandHandlers],
    exports: [WitService]
})
export class WitModule {}
