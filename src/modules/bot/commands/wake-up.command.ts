import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Message } from 'discord.js'

export class WakeUpCommand {
    constructor(public readonly content: string, public readonly context: Message) {}
}

@CommandHandler(WakeUpCommand)
export class WakeUpCommandHandler implements ICommandHandler<WakeUpCommand> {
    async execute(command: WakeUpCommand) {
        if (command.content.length > 0) {
            const replies = command.context.mentions.users.map((user) =>
                command.context.channel.send(`${command.context.guild?.member(user)?.nickname ?? user.username}, needs to wake up!`)
            )
            if (replies.length === 0) {
                replies.push(command.context.reply('needs to wake up!'))
            }
            await Promise.allSettled(replies)
        } else {
            await command.context.reply(' wake up!')
        }
    }
}
