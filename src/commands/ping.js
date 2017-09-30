module.exports = function listen(client, dispatcher) {
    dispatcher.on('ping', msg => {
        var args = msg.content.split(' ');
        if(args.length > 1) {
            var user = msg.channel.members.find('displayName', args[1]);
            msg.channel.send(' suck it!', {reply : user});
        } else {
            msg.reply('suck it');
        }
    });
}
