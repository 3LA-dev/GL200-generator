#!/usr/bin/env node
var optimist = require('optimist');
var net = require('net');

var DOG_TRACKER_LOGIN = "(013500001112BP05000013500001112120903A5956.1894N01046.9892E006.0160134061.9600000000L00000000)";
var DOG_TRACKER_ISOCHRONOUS_FOR_CONTINUES_FEEDBACK_MESSAGE = "(013500001112BR00120903A5955.9535N01047.4548E000.0160957000.0000000000L00000000)"


var argv = optimist.usage('Usage: $0 --interval [num] -serial [num] -lat [latitude] -lng [longitude]').
    options('i', {
        alias : 'interval',
        default : '30',
        describe: 'update interval'
    }).
    options('s', {
        alias : 'serial',
        default : '',
        describe: '013612345678'
    }).
    options('x', {
        alias : 'lat',
        default : '52.80113',
        describe: 'initial latitude'
    }).
    options('y', {
        alias : 'lng',
        default: '-1.63130',
        describe: 'initial longitude'
    }).
    options('h', {
        alias : 'host',
        describe: 'server host'
    }).
    options('p', {
        alias : 'port',
        describe: 'server port',
        default: '1337'
    }).
    argv;

var client = net.connect({host:argv.host, port:argv.port }, function() {
     client.write(DOG_TRACKER_LOGIN);
     console.log('login sent');
});
