"use strict";

const Helper = require("../../helper");
const colors = require("colors/safe");

function tokenAuth(manager, client, user, authToken, callback) {
		// If no user is found, or if the client has not provided a password,
	// fail the authentication straight away
	if (!client || !authToken) {
		return callback(false);
	}

	// If this user has no auth token set, fail the authentication
	if (!client.authToken) {
		log.error(`User ${colors.bold(user)} with no auth token set tried to sign in.`);
		return callback(false);
	}
	
	 
	const matching = client.authToken === authToken;
	
	client.authToken = false;  //tokens are single use
	
	callback(matching)
}


function isTokenEnabled() {
	return Helper.config.token_auth && Helper.config.token_auth.enabled && Helper.config.api && Helper.config.api.enabled;
}

module.exports = {
	auth: tokenAuth,
	isEnabled: isTokenEnabled,
};
