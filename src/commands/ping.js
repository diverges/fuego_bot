module.exports = function listen(client, dispatcher) {
    dispatcher.on('ping', msg => {
        msg.reply('suck it!');
    });
}
