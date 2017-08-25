module.exports = function listen(client, dispatcher) {
	dispatcher.on('bro', msg => {
        msg.reply('bro, chill with the bro');
    });
}
