import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Message } from 'discord.js'

export class WrongCommand {
    constructor(public readonly content: string, public readonly context: Message) {}
}

@CommandHandler(WrongCommand)
export class WrongCommandHandler implements ICommandHandler<WrongCommand> {
    async execute(command: WrongCommand) {
        if (command.content.length > 0) {
            const replies = command.context.mentions.users.map((user) =>
                command.context.channel.send(`${command.context.guild?.member(user)?.nickname ?? user.username}, played the wrongo bongo!`)
            )
            if (replies.length === 0) {
                replies.push(command.context.reply('played the wrongo bongo!'))
            }
            await Promise.allSettled(replies)
        } else {
            await command.context.reply('you played the wrongo bongo')
        }
    }
}
