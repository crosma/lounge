"use strict";

const redis = require('redis');

const Helper = require("./helper");

const redisClient = redis.createClient();
const redisSub = redis.createClient();


var manager = null;

const queue_name = `GAME_TO_LOUNGE_${Helper.config.port}`

module.exports.initialize = function(clientManager) {
	manager = clientManager;
	
	redisSub.subscribe(queue_name);
	redisSub.on('message', function (channel, data) {
		if (channel == queue_name) {
			message(data);
		}
	});
	
}

function message(data)
{
	try {
		var data = JSON.parse(data);
		
		const client = manager.loadUser(data.username);
		
		if (client && client.networks.length > 0) {
			let network = client.networks[0];

			//parse emotes and turn them into actions
			if (data.message.toLowerCase().indexOf('/me ') == 0) {
				data.message = data.message.substring(4);
				
				data.message = `ACTION ${data.message}`;
			}
			
			network.irc.say(data.channel, data.message);
			
			network.irc.emit("privmsg", {
				nick: network.irc.user.nick,
				target: data.channel,
				message: data.message,
			});
		}
	} catch (e) {
		console.error(e);
	}	
}