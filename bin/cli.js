#!/usr/bin/env node

'use strict';

var pkg = require('../package.json');
var Promise = require('rsvp').Promise;
var CMDS = ['on', 'off', 'state', 'toggle', 'temp', 'voltage'];

var _ = require('lodash');

var yargs = require('yargs');
var argv = yargs
	.usage('Usage: $0 cmd [relay] [opts]')
	.demand(1)
	.version(pkg.version + '\n', 'version')
	.showHelpOnFail(true, 'Valid commands are: ' + CMDS.join(', '))
	.describe('p', 'The usb port uri to use. Leave empty to use port scan')
	.alias('p', 'port')
	.describe('n', 'The number of relays on the board')
	.alias('n', 'relayCount')
	.defaults('n', 2)
	.boolean('v')
	.describe('v', 'Enables verbose mode (for debug only)')
	.check(function (argv, opts) {
		return _.contains(CMDS, argv._[0]);
	})
	.argv;

var Tosr0x = require('tosr0x').Tosr0x;
var cmd = argv._[0];
var ctl;

process.title = 'Tosr0x';

var create = function () {
	var options = {
		debug: argv.v
	};
	if (!argv.p) {
		return Tosr0x.fromPortScan(options);
	} else {
		return new Promise(function (res) {
			res(new Tosr0x(argv.p, options));
		});
	}
};

var run = function (c) {
	ctl = c;
	return ctl[cmd]();
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
