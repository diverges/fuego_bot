import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Message } from 'discord.js'

export class MediaReactCommand {
    constructor(public readonly content: string, public readonly context: Message) {}
}

@CommandHandler(MediaReactCommand)
export class MediaReactCommandHandler implements ICommandHandler<MediaReactCommand> {
    async execute(command: MediaReactCommand) {
        await command.context.react('🔥')
        await command.context.react('🍆')
    }
}
