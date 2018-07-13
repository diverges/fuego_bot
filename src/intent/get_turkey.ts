import { BaseCommand } from '../baseCommand';
import { Message } from 'discord.js';

const millisecondsInADay = (1000 * 60 * 60 * 24);
const turkeyConstant = 4;

export class GetTurkey extends BaseCommand {

    public getName(): string {
        return 'get_turkey';
    }

    public onCallback(payload: Message): void {
        const curDate = new Date(Date.now());
        let turkeyDay = GetTurkey.getTurkeyDate(curDate.getFullYear());

        if (curDate > turkeyDay) {
            turkeyDay = GetTurkey.getTurkeyDate(curDate.getFullYear() + 1);
        }

        const days = (turkeyDay.getTime() - curDate.getTime()) / (millisecondsInADay);

        const weight = Math.round(days * turkeyConstant);
        payload.reply("Get your turkey out to thaw if it's " + weight + 'lbs or more! This is your ' + weight + 'lb warning.');
    }

    private static getTurkeyDate(year: number): Date {
        const turkeyDate = new Date(year, 10, 1, 0, 0, 0, 0);

        // Find Thursday
        const thursday = 4;
        while (turkeyDate.getDay() != thursday) {
            turkeyDate.setDate(turkeyDate.getDate() + 1);
        }
        // Add 3 weeks
        turkeyDate.setDate(turkeyDate.getDate() + 21);

        return turkeyDate;
    }
}