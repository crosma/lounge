"use strict";

const Msg = require("../../models/msg");

exports.commands = ["connect", "server"];
exports.allowDisconnected = true;

exports.input = function(network, chan, cmd, args) {
	const lobby = network.channels[0];
	const msg = new Msg({
		type: Msg.Type.ERROR,
		text: "You may not connect to other networks.",
		showInActive: true,
	});
	lobby.pushMessage(client, msg, true);
	return false;

	
	if (args.length === 0) {
		network.userDisconnected = false;
		this.save();

		const irc = network.irc;

		if (!irc) {
			return;
		}

		if (irc.connection && irc.connection.connected) {
			chan.pushMessage(this, new Msg({
				type: Msg.Type.ERROR,
				text: "You are already connected.",
			}));
			return;
		}

		irc.connect();

		return;
	}

	let port = args[1] || "";
	const tls = port[0] === "+";

	if (tls) {
		port = port.substring(1);
	}

	const host = args[0];
	this.connect({host, port, tls});

	return true;
};
