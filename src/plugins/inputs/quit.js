"use strict";

<<<<<<< HEAD
const Msg = require("../../models/msg");

var _ = require("lodash");
=======
const _ = require("lodash");
>>>>>>> origin/master
const Helper = require("../../helper");

exports.commands = ["quit"];
exports.allowDisconnected = true;

exports.input = function(network, chan, cmd, args) {
	var client = this;
	
	const lobby = network.channels[0];
	const msg = new Msg({
		type: Msg.Type.ERROR,
		text: "You may not disconnect.",
		showInActive: true,
	});
	lobby.pushMessage(client, msg, true);
	
	return false;


	
	client.networks = _.without(client.networks, network);
	network.destroy();
	client.save();
	client.emit("quit", {
		network: network.uuid,
	});

	if (network.irc) {
		const quitMessage = args[0] ? args.join(" ") : Helper.config.leaveMessage;
		network.irc.quit(quitMessage);
	}

	return true;
};
