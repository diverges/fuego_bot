import { Injectable } from '@nestjs/common'
import { ICommand, ofType, Saga } from '@nestjs/cqrs'
import { Observable } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { RunWitCommand } from 'src/modules/wit/commands/run-wit.command'
import { MediaReactCommand } from '../commands/media-react.command'
import { OnMessageEvent } from '../events/on-message.event'

@Injectable()
export class BotSagas {
    @Saga()
    onMessage = (events$: Observable<any>): Observable<ICommand> => {
        return events$.pipe(
            ofType(OnMessageEvent),
            mergeMap((event: OnMessageEvent) => {
                const events: ICommand[] = []
                if (event.message.mentions.users.has(event.message.client.user?.id ?? '')) {
                    events.push(new RunWitCommand(event.message.content, event.message))
                }
                if (event.message.embeds.length > 0 || event.message.attachments.array().length > 0) {
                    events.push(new MediaReactCommand(event.message.content, event.message))
                }
                return events
            })
        )
    }
}
