import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Message } from 'discord.js'

export class WakeUpCommand {
    constructor(public readonly content: string, public readonly context: Message) {}
}

@CommandHandler(WakeUpCommand)
export class WakeUpCommandHandler implements ICommandHandler<WakeUpCommand> {
    async execute(command: WakeUpCommand) {
        if (command.content.length > 0) {
            const user = command.context.mentions.users.first()
            await command.context.channel.send(' needs to wake up!', { reply: user })
        } else {
            await command.context.reply(' wake up!')
        }
    }
}
