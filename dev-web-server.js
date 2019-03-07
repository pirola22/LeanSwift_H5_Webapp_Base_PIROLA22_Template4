/**
 * To start the node web server to serve the static pages of the h5 application
 * from the current directory, execute the js in node from the command line eg,
 * node dev-web-server.js
 */
var connect = require('connect');
var serveStatic = require('serve-static');
var http = require("http");
var https = require("https");

var port = "8282"; // default web server port
var path = "."; // current directory
var proxyPort = "8283"; // default proxy server port
var h5Server = "hermes.tac.com"; // H5 server
var h5ServerPort = "25107"; // H5 Server port
var h5Credentials = "pirola22:lector3"; //H5 User Credentials

console.log('Starting web server at localhost:' + port + '/mne/apps/customh5application');
connect().use('/mne/apps/customh5application', serveStatic(path)).listen(port);

startProxyServerForRemoteM3(proxyPort, h5Server, h5ServerPort);

function startProxyServerForRemoteM3(localPort, remoteHost, remotePort) {
	console.log("Starting proxy http://localhost:" + localPort + " -> http://" + remoteHost + ":" + remotePort);

	var server = http.createServer(function(request, response) {

		var authH5User = 'Basic ' + new Buffer(h5Credentials).toString('base64');
		request.headers["Authorization"] = authH5User;
		var options = {
			hostname : remoteHost,
			port : remotePort,
			path : request.url,
			method : request.method,
			headers : request.headers,
			rejectUnauthorized : false
		};

		try {
			var proxyRequest = http.request(options);
			proxyRequest.on("response", function(proxyResponse) {
				try {
					proxyResponse.on("data", function(chunk) {
						response.write(chunk, "binary");
					});
					proxyResponse.on("end", function() {
						response.end();
					});
					proxyResponse.on("error", function(e) {
						console.log("Request error: " + e);
					});
					proxyResponse.headers["Access-Control-Allow-Origin"] = "*";
					response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
				} catch (ex) {
					console.log("Exception on receiving response " + ex);
				}
			});
			request.on("data", function(chunk) {
				try {
					proxyRequest.write(chunk, "binary");
				} catch (ex) {
					console.log("Error writing the data " + ex);
				}
			});
			request.on("end", function() {
				try {
					proxyRequest.end();
				} catch (ex) {
					console.log("Error while ending the proxy request " + ex);
				}
			});
		} catch (ex) {
			console.log("Exception occurred " + ex);
		}
	});

	server.on("clientError", function(e) {
		console.log("Client error: " + e);
	});

	process.on("uncaughtException", function(e) {
		console.log("Uncaught exception: " + e);
	});

	server.listen(localPort);
}