module.exports = function listen(client, dispatcher) {
    
    const millisecondsInADay = (1000*60*60*24);
    const turkeyConstant = 4;
    
    var getTurkeyDate = function(year)
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
        
    dispatcher.on('get_turkey', payload => {
        var curDate = new Date(Date.now());
        var turkeyDay = getTurkeyDate(curDate.getFullYear());
        
        if(curDate > turkeyDay)
        {
            turkeyDay = getTurkeyDate(curDate.getFullYear()+1);
        }

        var days =  (turkeyDay.getTime() - curDate.getTime()) / (millisecondsInADay);
              
        var weight = Math.round(days * turkeyConstant);
        payload.msg.reply("Get your turkey out to thaw if it's " + weight + "lbs or more! This is your " + weight + "lb warning.");
    });
}