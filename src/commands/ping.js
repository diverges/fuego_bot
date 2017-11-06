module.exports = function listen(client, dispatcher) {
    dispatcher.on('ping', msg => {
        var args = msg.content.split(' ');
        if(args.length > 1) {
            var name = args.slice(1, args.length).join(' ')
            var user = msg.channel.members.find('displayName', name);
            msg.channel.send(' suck it!', {reply : user});
        } else {
            msg.reply('suck it');
        }
    });
}
