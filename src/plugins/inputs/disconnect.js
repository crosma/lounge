"use strict";

const Msg = require("../../models/msg");

const Helper = require("../../helper");

exports.commands = ["disconnect"];

exports.input = function({irc}, chan, cmd, args) {
	chan.pushMessage(this, new Msg({
		type: Msg.Type.ERROR,
		text: "You may not disconnect.",
		showInActive: true,
	}));
	return false;
	
	const quitMessage = args[0] ? args.join(" ") : Helper.config.leaveMessage;

	irc.quit(quitMessage); 
};
    