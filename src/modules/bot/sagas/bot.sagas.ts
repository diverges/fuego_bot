import { Injectable } from '@nestjs/common'
import { ICommand, ofType, Saga } from '@nestjs/cqrs'
import { Observable } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { RunWitCommand } from 'src/modules/wit/commands/run-wit.command'
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
                return events
            })
        )
    }
}
