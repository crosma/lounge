"use strict";

const Msg = require("../../models/msg");

exports.commands = ["raw", "send", "quote"];

exports.input = function(network, chan, cmd, args) {
	const lobby = network.channels[0];
	const msg = new Msg({
		type: Msg.Type.ERROR,
		text: "RAW is disabled for lounge users.",
		showInActive: true,
	});
	lobby.pushMessage(client, msg, true);
	
	return false;

	if (args.length !== 0) {
		irc.raw(args);
	}

	return true;
};
