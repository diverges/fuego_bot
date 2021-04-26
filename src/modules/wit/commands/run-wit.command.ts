import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Message } from 'discord.js'
import { GetTurkeyCommand } from 'src/modules/bot/commands/get-turkey.command'
import { WitService } from '../wit.service'

export class RunWitCommand {
    constructor(public readonly content: string, public readonly context: Message) {}
}

@CommandHandler(RunWitCommand)
export class RunWitCommandHandler implements ICommandHandler<RunWitCommand> {
    constructor(private readonly witService: WitService, private readonly commandBus: CommandBus) {}

    async execute(command: RunWitCommand) {
        const data = await this.witService.message(command.context.cleanContent)
        const actions = data.intents.filter((intent) => intent.name === 'get_turkey')
        const test = actions.filter((intent) => intent.confidence >= 0.7)
        if (test.length > 0) {
            await this.commandBus.execute(new GetTurkeyCommand(command.content, command.context))
        } else if (actions.length > 0) {
            const reply = await command.context.reply(`Ya can't fool me`)
            await reply.react('👀')
        }
    }
}
