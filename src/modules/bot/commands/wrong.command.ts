import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Message } from 'discord.js'

export class WrongCommand {
    constructor(public readonly content: string, public readonly context: Message) {}
}

@CommandHandler(WrongCommand)
export class WrongCommandHandler implements ICommandHandler<WrongCommand> {
    async execute(command: WrongCommand) {
        if (command.content.length > 0) {
            const user = command.context.mentions.users.first()
            await command.context.channel.send(' played the wrongo bongo!', { reply: user })
        } else {
            await command.context.reply('you played the wrongo bongo')
        }
    }
}
