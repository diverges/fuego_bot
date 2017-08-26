
const gith = require('gith').create( 8081 );
const exec = require('util').exec;

console.log(gith);

gith({
    repo : 'diverges/fuego_bot',
    branch : 'master'
}).on('all', function(payload) {
    console.log('Post-receive happened!');

    exec(' cd ../ && pm2 deploy ecosystem.json.js --force', (err, stdout, stderr) => {
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
    );
});
