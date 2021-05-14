var EventEmitter = require('events');
var prompt = new EventEmitter();
var current = null;
var result = {};
//process.stdin.resume();

process.stdin.on('data', function (data) {
    if (data === 'exit') {
        current = ':end'
    } else {
        current = ':new';
    }

    prompt.emit(current, data.toString().trim());
});



prompt.on(':new', function (data) {
    process.stdout.write('> ');
});

prompt.on(':end', function () {
    console.log('\n', result);
    process.stdin.pause();
});

prompt.emit(':new');