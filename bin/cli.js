#!/usr/bin/env node

'use strict';

var pkg = require('../package.json');
var Promise = require('rsvp').Promise;
var CMDS = ['on', 'off', 'state', 'temp', 'version', 'voltage'];

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

var create = function () {
	var options = {
		debug: argv.v,
		relayCount: argv.n
	};
	if (!argv.p) {
		return Tosr0x.fromPortScan(); // TODO: put options when available
	} else {
		return new Promise(function (res) {
			res(new Tosr0x(argv.p, options));
		});
	}
};

var run = function (c) {
	ctl = c;
	return ctl.open().then(function () {
		return ctl[cmd](parseInt(argv._[1], 10) || 0);
	});
};

var display = function (res) {
	console.log(res);
	console.log('Done.');
};

var error = function (err) {
	console.error(err);
};

var close = function () {
	if (!!ctl) {
		ctl.closeImmediate();
	}
};

create()
	.then(run)
	.then(display)
	.catch(error)
	.finally(close);
