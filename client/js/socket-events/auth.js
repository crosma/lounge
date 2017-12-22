"use strict";

const $ = require("jquery");
const queryString = require('query-string');
const createHistory = require('history').createBrowserHistory
const socket = require("../socket");
const storage = require("../localStorage");
const utils = require("../utils");
const templates = require("../../views");
const {vueApp} = require("../vue");

socket.on("auth", function(data) {
	// If we reconnected and serverHash differs, that means the server restarted
	// And we will reload the page to grab the latest version
	if (utils.serverHash > -1 && data.serverHash > -1 && data.serverHash !== utils.serverHash) {
		socket.disconnect();
		vueApp.isConnected = false;
		vueApp.currentUserVisibleError = "Server restarted, reloading…";
		location.reload(true);
		return;
	}

	const login = $("#sign-in");

	if (data.serverHash > -1) {
		utils.serverHash = data.serverHash;

		login.html(templates.windows.sign_in());

		utils.togglePasswordField("#sign-in .reveal-password");

		login.find("form").on("submit", function() {
			const form = $(this);

			form.find(".btn").prop("disabled", true);

			const values = {};
			$.each(form.serializeArray(), function(i, obj) {
				values[obj.name] = obj.value;
			});

			storage.set("user", values.user);

			socket.emit("auth", values);

			return false;
		});
	} else {
		login.find(".btn").prop("disabled", false);
	}

	let token;
	const user = storage.get("user");
	


	if (!data.success) {
		if (login.length === 0) {
			socket.disconnect();
			vueApp.isConnected = false;
			vueApp.currentUserVisibleError = "Authentication failed, reloading…";
			location.reload();
			return;
		}

		storage.remove("token");

		const error = login.find(".error");
		error.show().closest("form").one("submit", function() {
			error.hide();
		});
	} else if (user) {
		token = storage.get("token");

		if (token) {
			vueApp.currentUserVisibleError = "Authorizing…";
			$("#loading-page-message").text(vueApp.currentUserVisibleError);

			let lastMessage = -1;

			for (const network of vueApp.networks) {
				for (const chan of network.channels) {
					for (const msg of chan.messages) {
						if (msg.id > lastMessage) {
							lastMessage = msg.id;
						}
					}
				}
			}

			socket.emit("auth", {user, token, lastMessage});
		}
	}
	
		console.log('auth', data, user, '+' + token);
	
	// If the query string contains a user and auth token, try to login with
	// them but only if there is no session token
	const parsed = queryString.parse(location.search);
	if (!token && parsed.user && parsed.authToken) {
		storage.set("user", parsed.user);

		socket.emit("auth", {
			user: parsed.user,
			password: parsed.authToken,
		});
		
		// Since the token is single use remove it from the URL to prevent
		// any issues with reusing an existing session
		const history = createHistory()
		
		history.push('/')
	}
		
		

	if (user) {
		login.find("input[name='user']").val(user);
	}

	if (token) {
		return;
	}

	$("#loading").remove();
	$("#footer")
		.find(".sign-in")
		.trigger("click", {
			pushState: false,
		});
});
