import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Message } from 'discord.js'

export class PingCommand {
    constructor(public readonly content: string, public readonly context: Message) {}
}

@CommandHandler(PingCommand)
export class PingCommandHandler implements ICommandHandler<PingCommand> {
    async execute(command: PingCommand) {
        const replies = command.context.mentions.users.map((user) =>
            command.context.channel.send(`${command.context.guild?.member(user)?.nickname ?? user.username}, suck it!`)
        )
        if (replies.length === 0) {
            replies.push(command.context.reply('suck it!'))
        }
        await Promise.allSettled(replies)
    }
}
