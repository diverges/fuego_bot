import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { Message } from 'discord.js'

export class OnMessageEvent {
    constructor(public readonly message: Message) {}
}

@EventsHandler(OnMessageEvent)
export class OnMessageEventHandler implements IEventHandler<OnMessageEvent> {
    handle(event: OnMessageEvent) {
        //
    }
}
