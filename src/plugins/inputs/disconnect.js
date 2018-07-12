"use strict";

const Msg = require("../../models/msg");

const Helper = require("../../helper");

exports.commands = ["disconnect"];

exports.input = function({irc}, chan, cmd, args) {
	const lobby = network.channels[0];
	const msg = new Msg({
		type: Msg.Type.ERROR,
		text: "You may not disconnect.",
		showInActive: true,
	});
	lobby.pushMessage(client, msg, true);
	return false;
	
	const quitMessage = args[0] ? args.join(" ") : Helper.config.leaveMessage;

	irc.quit(quitMessage);
};
