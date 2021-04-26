import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Message } from 'discord.js'

export class GetTurkeyCommand {
    constructor(public readonly content: string, public readonly context: Message) {}
}

@CommandHandler(GetTurkeyCommand)
export class GetTurkeyCommandHandler implements ICommandHandler<GetTurkeyCommand> {
    private readonly turkeyConstant = 4
    private readonly millisecondsInADay = 1000 * 60 * 60 * 24

    async execute(command: GetTurkeyCommand) {
        const curDate = new Date(Date.now())
        let turkeyDay = this.getTurkeyDate(curDate.getFullYear())

        if (curDate > turkeyDay) {
            turkeyDay = this.getTurkeyDate(curDate.getFullYear() + 1)
        }

        const days = (turkeyDay.getTime() - curDate.getTime()) / this.millisecondsInADay
        const weight = Math.round(days * this.turkeyConstant)

        await command.context.reply("Get your turkey out to thaw if it's " + weight + 'lbs or more! This is your ' + weight + 'lb warning.')
    }

    private getTurkeyDate(year: number): Date {
        const turkeyDate = new Date(year, 10, 1, 0, 0, 0, 0)

        // Find Thursday
        const thursday = 4
        while (turkeyDate.getDay() != thursday) {
            turkeyDate.setDate(turkeyDate.getDate() + 1)
        }
        // Add 3 weeks
        turkeyDate.setDate(turkeyDate.getDate() + 21)

        return turkeyDate
    }
}
