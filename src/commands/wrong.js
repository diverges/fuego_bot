module.exports = function listen(client, dispatcher) {
    dispatcher.on('wrong', msg => {
        var args = msg.content.split(' ');
        if(args.length > 1) {
            var name = args.slice(1, args.length).join(' ')
            var user = msg.channel.members.find('displayName', name);
            msg.channel.send(' played the wrongo bongo!', {reply : user});
        } else {
            msg.reply('you played the wrongo bongo');
        }
    });
}
