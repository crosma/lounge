"use strict";

const ClientManager = require("../clientManager");

module.exports = function(req, res, next) {
	if (!req.query.name) {
		res.statusCode = 400;
		res.end("error: missing required argument 'name'");
	} else { 
		const manager = req.app.get('ClientManager');
		const client = manager.loadUser(req.query.name);

		if (!client) {
			res.statusCode = 400;
			res.end(`User "${req.query.name}" does not exist.`);
		} else {
			require('crypto').randomBytes(48, function(err, buffer) {
				var token = buffer.toString('hex');
				
				client.authToken = token;

				res.send(token);
			});
		}
	}
} 