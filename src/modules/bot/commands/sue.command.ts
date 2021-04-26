import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Message } from 'discord.js'

export class SueCommand {
    constructor(public readonly content: string, public readonly context: Message) {}
}

@CommandHandler(SueCommand)
export class SueCommandHandler implements ICommandHandler<SueCommand> {
    async execute(command: SueCommand) {
        const messages = await command.context.channel.messages.fetch({ before: command.context.id, limit: 1 })
        const message = messages.first()
        if (message) {
            const emojis = ['🅾', '🅱', '🇯', '🇪', '🇨', '🇹', '🇮', '🇴', '🇳', '❗']
            await Promise.allSettled(emojis.map((em) => message.react(em)))
        }
    }
}
