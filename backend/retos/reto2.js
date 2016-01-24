var Request = require('request');
var Hapi = require("hapi");
var Handlebars = require("handlebars");

/**
* Obtain your api key from : http://steamcommunity.com/dev and set to
* enviroment variable STEAM_KEY.
*
* Run app in terminal: 
*  Ubuntu : STEAM_KEY=*YOUR_KEY* node reto2.js
*  Windows: set STEAM_KEY=*YOUR_KEY* node reto2.js
*/
var STEAM_KEY = process.env.STEAM_KEY;
var STEAM_API = "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/"

var DEFAULTS_PARAMS = {
	format:"json",
	key:STEAM_KEY
};

var server = new Hapi.Server();
server.connection({
	host:'localhost',
	port : 8000
});


var html_raw_template = "<html>"+
"{{#if error}}"+
"<div> error : {{error}}"+
"{{/if}}"+
"{{#if id}}"+
"<div> Steam NickName : {{nickname}}"+
"<div> Steam ID : {{id}}</div>"+
"{{else}}"+
"<div> You not exist </div>"+
"{{/if}}"+
"</html>";

template = Handlebars.compile(html_raw_template);

server.route({
	method:'GET',
	path:"/{username}",
	handler:function(request,reply){
		
		var nickname  = request.params.username;

		var params = {
			format:DEFAULTS_PARAMS.format,
			key:DEFAULTS_PARAMS.key,
			vanityurl : nickname
		};

		Request.get(STEAM_API,{qs:params,json:true},function(err,res,payload){
			if(err){
				reply(template({error:err}));
			}else{
			
				var response = payload.response || {};
				if(response.success){
					var context = {
						nickname : nickname,
						id : response.steamid
					};
					reply(template(context));
				}else{
					reply(template({error:new Error("Nickname wrong or something else, kek")}));
				}
	
			}
		});
	
		
	}
})

server.start(function(){
	console.log("Server runnning at localhost:8000");
});
