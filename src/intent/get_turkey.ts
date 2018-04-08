import { BaseCommand } from '../baseCommand';
import { TextChannel, Message } from 'discord.js';

const millisecondsInADay = (1000*60*60*24);
const turkeyConstant = 4;

export default class GetTurkey extends BaseCommand {

    public getName(): string {
        return "get_turkey";
    }

    public onCallback(payload: Message): void {        
        var curDate = new Date(Date.now());
        var turkeyDay = GetTurkey.getTurkeyDate(curDate.getFullYear());
            
        if(curDate > turkeyDay)
        {
            turkeyDay = GetTurkey.getTurkeyDate(curDate.getFullYear()+1);
        }
    
        var days =  (turkeyDay.getTime() - curDate.getTime()) / (millisecondsInADay);
                  
        var weight = Math.round(days * turkeyConstant);
        payload.reply("Get your turkey out to thaw if it's " + weight + "lbs or more! This is your " + weight + "lb warning.");
    }

    private static getTurkeyDate(year : number) : Date
    {
        var turkeyDate = new Date(year, 10, 1, 0, 0, 0, 0);
        
        // Find Thursday.  
        var thursday = 4;  
        while(turkeyDate.getDay() != thursday) {  
            turkeyDate.setDate(turkeyDate.getDate() + 1);  
            console.log(turkeyDate);
        }
        // Add 3 weeks.  
        turkeyDate.setDate(turkeyDate.getDate() + 21);  
        
        return turkeyDate;
    }
}