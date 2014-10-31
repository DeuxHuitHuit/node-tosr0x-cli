#!/usr/bin/env node

'use strict';

var pkg = require('../package.json');
var Promise = require('rsvp').Promise;
var CMDS = ['on', 'off', 'state', 'temp', 'version', 'voltage'];
var exitCode = 0;
var _ = require('lodash');
var yargs = require('yargs');
var argv = yargs
	.demand(1)
	.usage('Usage: $0 cmd [relay] [opts]')
	.help('h')
	.alias('h', ['?', 'help'])
	.version(pkg.version + '\n', 'version')
	.showHelpOnFail(true, 'Valid commands are: ' + CMDS.join(', '))
	.describe('p', 'The usb port uri to use. Leave empty to use port scan')
	.alias('p', 'port')
	.describe('n', 'The number of relays on the board')
	.alias('n', 'relayCount')
	.defaults('n', 2)
	.boolean('v')
	.describe('v', 'Enables verbose mode (for debug only)')
	.alias('v', 'verbose')
	.check(function (argv, opts) {
		return _.contains(CMDS, argv._[0]);
	})
	.argv;

var Tosr0x = require('tosr0x').Tosr0x;
var cmd = argv._[0];
var ctl;

process.title = 'Tosr0x';

if (cmd === 'temp') {
	cmd = 'temperature';
} else if (cmd === 'state') {
	cmd = 'refreshStates';
}

var run = function (c) {
	ctl = c;
	return ctl.open().then(function () {
		return ctl[cmd](argv._[1]);
	});
};

var display = function (res) {
	if (_.isObject(res)) {
		_.forOwn(res, function (val, key) {
			if (key !== 'ctl') {
				console.log(val);
			}
		});
	} else {
		console.log(res);
	}
	console.log('Done.');
};

var error = function (err) {
	console.error(err);
	exitCode = 1;
};

var close = function () {
	if (!!ctl) {
		ctl.closeImmediate();
	}
	process.exit(exitCode);
};

Tosr0x.create(argv.p, {
	debug: argv.v,
	relayCount: argv.n
})
.then(run)
.then(display)
.catch(error)
.finally(close);
