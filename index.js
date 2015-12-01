#!/usr/bin/env node

var optimist = require('optimist');
var net = require('net');
var readline = require('readline');
var moment = require('moment');
var rl = readline.createInterface(process.stdin, process.stdout);

//::::::::::::::::::::::::::::::::::::::: Datos Generales del GPS
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
		lac: 'ffff',
		cellId: '1234',
		reserved: '00',
		battery: '100',
		count: 'FFFF'
	}
	//:::::::::::::::::::::::::::::::::::::: Frame Base
var frameBase = datGL200.protocolVersion + ',' +
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
	//020102,123456789123654,,0,0,5217721199947,20,127.5,123,340,-98.707299,20.102827,20151130214943,0334,0020,1234,1234,00,100,20151130214943,FFFF$
	//::::::::::::::::::::::::::::::::::::: Opciones de inicio
	// >> node index.js -h 127.0.0.1 -p 8090
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

//::::::::::::::::::::::::::::::::::::::: Socket connection
var client = net.connect({
	host: argv.host,
	port: argv.port
}, function () {
	// ::::::::::::::::::::::::::::::::: Menu
	rl.setPrompt('GL200>> ');
	console.log('         IP: ' + argv.host + '  Port:' + argv.port);
	console.log('=======================================');
	console.log('             GL200-Generator');
	console.log('=======================================\n\n');
	console.log('------General Posotion Report\n');
	console.log('/geo --- GTGEO');
	console.log('/sos --- GTSOS\n\n');
	rl.prompt();
	rl.on('line', function (line) {
		switch (line.trim()) {
			//:::::::::::::::::::::::::::::::::::::::::::::::::: +RESP:GTSOS	//+RESP:GTSOS,020102,123456789123654,,0,0,5217721199947,20,127.5,123,340,-98.707299,20.102827,20151130214943,0334,0020,1234,1234,00,100,20151130214943,FFFF$
		case '/sos':
			console.log('--------------------SOS Trama Enviada')
			console.log('+RESP:GTSOS,' + frameBase)
			client.write('+RESP:GTSOS,' + frameBase);
			break;
			//:::::::::::::::::::::::::::::::::::::::::::::::: +RESP:GTGEO	//+RESP:GTGEO,020102,123456789123654,,0,0,5217721199947,20,127.5,123,340,-98.707299,20.102827,20151201120845,0334,0020,ffff,1234,00,100,20151201120845,FFFF$
		case '/geo':
			console.log('--------------------GEO Trama Enviada')
			console.log('+RESP:GTGEO,' + frameBase)
			client.write('+RESP:GTGEO,' + frameBase);
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

//+RESP:GTSOS,020102,135790246811220,,0,0,1,1,4.3,92,70.0,121.354335,31.222073,20090214013254,0460,0000,18d8,6141,00,,20090214093254,11F0$
//+RESP:GTSOS,020102,123456789123654,,0,0,5217721199947,20,127.5,123,340,-98.707299,20.102827,20151130214943,0334,0020,1234,1234,00,100,20151130214943,FFFF$