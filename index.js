#!/usr/bin/env node

var optimist = require('optimist');
var net = require('net');
var readline = require('readline');
var moment = require('moment');
var rl = readline.createInterface(process.stdin, process.stdout);

//::::::::::::::::::::::::::::::::::::::: Data GPS
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
//:::::::::::::::::::::::::::::::::::::: Array Frame Base
var frameBase = [];
frameBase.push(datGL200.protocolVersion)
frameBase.push(datGL200.uniqueID)
frameBase.push('')
frameBase.push('0')
frameBase.push('0')
frameBase.push(datGL200.number)
frameBase.push('20')
frameBase.push(datGL200.speed)
frameBase.push(datGL200.azimuth)
frameBase.push(datGL200.altitude)
frameBase.push(datGL200.longitude)
frameBase.push(datGL200.latitude)
frameBase.push(moment().format('YYYYMMDDHHmmss'))
frameBase.push(datGL200.mcc)
frameBase.push(datGL200.mnc)
frameBase.push(datGL200.lac)
frameBase.push(datGL200.cellId)
frameBase.push(datGL200.reserved)
frameBase.push(datGL200.battery)
frameBase.push(moment().format('YYYYMMDDHHmmss'))
frameBase.push(datGL200.count)
frameBase.push('$')
//020102,123456789123654,,0,0,5217721199947,20,127.5,123,340,-98.707299,20.102827,20151130214943,0334,0020,1234,1234,00,100,20151130214943,FFFF$


//::::::::::::::::::::::::::::::::::::: Startup Options
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
			console.log('/spd --- GTSPD');
			console.log('/rtl --- GTRTL:');
			console.log('/pnl --- GTPNL');
			console.log('/sos --- GTSOS\n\n');
			rl.prompt();
			rl.on('line', function (line) {
					switch (line.trim()) {
/*
:::::::::::::::::::::::::::::::::::::::::::::::::: +RESP:GTSOS	

+RESP:GTSOS,020102,123456789123654,,0,0,5217721199947,20,127.5,123,340,-98.707299,20.102827,20151202161044,0334,0020,ffff,1234,00,100,20151202161044,FFFF,$
*/
						case '/sos':
							console.log('--------------------SOS Trama Enviada');
							console.log('+RESP:GTSOS,' + frameBase);
							client.write('+RESP:GTSOS,' + frameBase);
							break;
/*
:::::::::::::::::::::::::::::::::::::::::::::::: +RESP:GTGEO enter the corresponding Geo-Fence

+RESP:GTGEO,020102,123456789123654,,0,1,5217721199947,20,127.5,123,340,-98.707299,20.102827,20151201120845,0334,0020,ffff,1234,00,100,20151201120845,FFFF$
*/
						case '/geo':
							console.log('--------------------GEO enter the corresponding Geo-Fence SEND...'); 
							var aux = frameBase[4];
							frameBase[4] = '1';
							console.log('\n+RESP:GTGEO,' + frameBase+'\n'); 
							client.write('+RESP:GTGEO,' + frameBase);
							frameBase[4] = aux;
							break;
/*
:::::::::::::::::::::::::::::::::::::::::: +RESP:GTSPD Inside the speed range.

+RESP:GTSPD,020102,123456789123654,,0,1,5217721199947,20,127.5,123,340,-98.707299,20.102827,20151202163848,0334,0020,ffff,1234,00,100,20151202163848,FFFF,$
*/
						case '/spd':
							console.log('--------------------+RESP:GTSPD The current logical status of the input is enable status.'); 
							var aux = frameBase[4];
							frameBase[4] = '1';
							console.log('\n+RESP:GTSPD,' + frameBase+'\n'); 
							client.write('+RESP:GTSPD,' + frameBase);
							frameBase[4] = aux;
						break;
/*
:::::::::::::::::::::::::::::::::::::::::: +RESP:GTSPD Inside the speed range.

+RESP:GTRTL,020102,123456789123654,,0,0,5217721199947,20,127.5,123,340,-98.707299,20.102827,20151202164516,0334,0020,ffff,1234,00,100,20151202164516,FFFF,$
*/
						case '/rtl':
							console.log('--------------------+RESP:GTRTL SEND!!'); 
							console.log('\n+RESP:GTRTL,' + frameBase+'\n'); 
							client.write('+RESP:GTRTL,' + frameBase);
						break;
/*
:::::::::::::::::::::::::::::::::::::::::: +RESP:GTPNL

+RESP:GTPNL,020102,123456789123654,,0,0,5217721199947,20,127.5,123,340,-98.707299,20.102827,20151202164516,0334,0020,ffff,1234,00,100,20151202164516,FFFF,$
*/
						case '/pnl':
							console.log('--------------------+RESP:GTPNL SEND!!'); 
							console.log('\n+RESP:GTPNL,' + frameBase+'\n'); 
							client.write('+RESP:GTPNL,' + frameBase);
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
