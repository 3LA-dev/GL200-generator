#!/usr/bin/env node

var optimist = require('optimist');
var net = require('net');
var readline = require('readline');
var moment = require('moment');
var rl = readline.createInterface(process.stdin, process.stdout);
var datGL200 = {
	protocolVersion: '020102',
	uniqueID: '123456789123654',
	deviceName: '',
	number: '5217721199947',
	speed: '127.5',
	azimuth: '123',
	altitude: '340',
	longitude: '-98.707299',
	latitude: '20.102827',
	mcc: '0334',
	mnc: '0020',
	lac: '1234',
	cellId: '1234',
	reserved: '00',
	battery: '100',
	count: 'FFFF'
}

rl.setPrompt('GL200>> ');

var argv = optimist.usage('Usage: $0 --host [NUMBER] -port [NUMBER]').
options('h', {
	alias: 'host',
	describe: 'server host',
	default: '127.0.0.1'
}).
options('p', {
	alias: 'port',
	describe: 'server port',
	default: '8090'
}).
argv;

var client = net.connect({
	host: argv.host,
	port: argv.port
}, function () {
	console.log('         IP: ' + argv.host + '  Port:' + argv.port);
	console.log('=======================================');
	console.log('             GL200-Generator');
	console.log('=======================================\n\n');
	console.log('------General Posotion Report\n');
	console.log('/sos --- GTSOS\n\n');
	rl.prompt();
	rl.on('line', function (line) {
		switch (line.trim()) {
		case '/sos':
			var frame = '+RESP:GTSOS,' +
				datGL200.protocolVersion + ',' +
				datGL200.uniqueID + ',,0,0,' +
				datGL200.number + ',20,' +
				datGL200.speed + ',' +
				datGL200.azimuth + ',' +
				datGL200.altitude + ',' +
				datGL200.longitude + ',' +
				datGL200.latitude + ',' +
				moment().format('YYYYMMDDHHmmss') + ',' +
				datGL200.mcc + ',' +
				datGL200.mnc + ',' +
				datGL200.lac + ',' +
				datGL200.cellId + ',' +
				datGL200.reserved + ',' +
				datGL200.battery + ',' +
				moment().format('YYYYMMDDHHmmss') + ',' +
				datGL200.count + '$'
			console.log(frame)
				//client.write(DOG_TRACKER_LOGIN);
			break;
		default:
			console.log('Comand Error');
			break;
		}
		rl.prompt();
	}).on('close', function () {
		console.log('---- Socket Disconnect');
		process.exit(0);
	});
});