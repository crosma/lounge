"use strict";

const _ = require("lodash");
const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	irc.on("part", function(data) {
		const chan = network.getChannel(data.channel);

		if (typeof chan === "undefined") {
			return;
		}

		const user = chan.getUser(data.nick);
		const msg = new Msg({
			type: Msg.Type.PART,
			time: data.time,
			text: data.message || "",
			hostmask: data.ident + "@" + data.hostname,
			from: user,
			self: data.nick === irc.user.nick,
		});
		chan.pushMessage(client, msg);

		if (data.nick === irc.user.nick && data.channel == '#main') {
			chan.pushMessage(this, new Msg({
				type: Msg.Type.ERROR,
				text: "You may not leave #main.",
			}));
			return;	
		}
		
		if (data.nick === irc.user.nick) {
			console.log('Is user');
			
			if (chan.name == '#main') {
				console.log('Is main');
				
				const msg = new Msg({
					time: Date.now(),
					type: Msg.Type.ERROR,
					text: "You may not leave #main.",
				});
				chan.pushMessage(client, msg);
				return false;
			}
			
			network.channels = _.without(network.channels, chan);
			chan.destroy();
			client.save();
			client.emit("part", {
				chan: chan.id,
			});
		} else {
			chan.removeUser(user);
			client.emit("users", {
				chan: chan.id,
			});
		}
	});
};
