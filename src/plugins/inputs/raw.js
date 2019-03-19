"use strict";

const Msg = require("../../models/msg");

exports.commands = ["raw", "send", "quote"];

<<<<<<< HEAD
exports.input = function(network, chan, cmd, args) {
	return false;

	if (args.length !== 0) {
		irc.raw(args);
	}

	return true;
};
