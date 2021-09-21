

// Require the TwitchJS library.
//https://id.twitch.tv/oauth2/authorize?client_id=kskak0xgrjt64xxd5c62m5wl77jd6u&redirect_uri=http://localhost&response_type=code&scope=chat:read+chat:edit
// https://api.twitch.tv/kraken/users/?login=thewrightdude&client_id=CLIENT_ID_HERE&a
const TwitchClient = require('twitch').default;
const ChatClient = require('twitch-chat-client').default;
const WebHookListener = require('twitch-webhooks').default;
const HelixStream = require('twitch').default;
var request = require('request');
var cheerio = require('cheerio');
const fs = require('fs-extra');
const fsfs = require('fs');

var gameLink = "";

var fileNameAlert = 'alert.html';

var fileNameChat = 'chat.html';

var alertActive =  false;

var lastThreeChats = ["","",""];

clearAlertHtml();
clearChatHtml();

(async() => {




const dataobj = JSON.parse(await fs.readFile('./data.json'));

const user = dataobj.user;
const password = dataobj.password;
const channel = dataobj.channel;
const access_token = dataobj.access_token;
const refresh_token = dataobj.refresh_token;
const client_id = dataobj.client_id;
const client_secret = dataobj.client_secret;
const userID = '131980451';



const twitchClient = TwitchClient.withCredentials(client_id, access_token, undefined, {
	client_secret,
	refresh_token
});


const chatClient = await ChatClient.forTwitchClient(twitchClient, { channels: ['thewrightdude']});
await chatClient.connect();

chatClient.say(channel, 'TheWrightBot is ready!');


chatClient.onSub((channel, user) => {
	chatClient.say(channel, `Wow ur a real bro @${user} thank you for subbing!`);
});


chatClient.onRaid((channel, user, raidInfo, msg) => {

	chatClient.say(channel, `Everyone get down! @${raidInfo.displayName} has breached 
	with ${raidInfo.viewerCount} friends!`);
	drawAlertHtml('0.8',"ranch","ranch",user, "Just followed!","PALEVIOLETRED");
	if(raidInfo.viewerCount >= 5)
	{
	chatClient.addVIP(channel,raidInfo.displayName);
	chatClient.say(channel, `Wow you must be special @${raidInfo.displayName} you're now a vip!`);
	}
});



chatClient.onPrivmsg((channel, user, message) => {

	// Scrolling chat
	

	  if (message === '!help') {
        chatClient.say(channel, 'Available commands are: !dice, !corona, !roblox, !game, !discord, !alertHelp, !listVIPs');
	} 
	else if(message === '!corona') {

		request(
			{ uri: "https://www.worldometers.info/coronavirus/" },
			function(error, response, body) {
				$ = cheerio.load(body);
				
				var corona = $('div.maincounter-number')
				.children()
				.first()
				.html();

				chatClient.say(channel, `There are currently: ${corona} cases of coronavirus in the world!`);
			}
		);
		
	}
	else if (message.split(',')[0] === "!soundBoard") {

		if(Number.isInteger(message.split(',')[1]))
		{
			soundBoard(message.split(',')[1]);
		}

	}
	else if (message === '!dice') {
		const diceRoll = Math.floor(Math.random() * 6) + 1;
        chatClient.say(channel, `@${user} rolled a ${diceRoll}`)

	}
	else if (message === '!roblox') {
		chatClient.say(channel, `https://www.roblox.com/users/790056/profile`);
	}
	else if (message === '!game') {
		chatClient.say(channel, `Currently playing: ` + gameLink);
	}
	else if (message.split(',')[0] === "!updateGame") {
		gameLink = message.split(',')[1];
	}
	else if (message === '!discord') {
		chatClient.say(channel, `https://discord.gg/3VAwQg`);
	}
	else if(message === "!alertHelp")
	{
		chatClient.say(channel, `to send an alert you must be VIP then type !alert,yourmessage`);
	}
	else if(message === "!clear")
	{
		clearAlertHtml();
	}
	else if(message.split(',')[0] === "!alert" && (user === 'thewrightdude' || userIsVIP(user,chatClient,channel)))
	{ 
		var alertArray = message.split(',');
		drawAlertHtml(user,alertArray[1]);
	}
	else if(message.split(',')[0] === "!addVIP" &&( user === 'thewrightdude' ))
	{
		var vipArray = message.split(',');
		chatClient.addVIP(channel,vipArray[1]);
		chatClient.say(channel, `Wow you must be special ` + vipArray[1] + " you're now a vip!");
	}
	else if(message === "!listVIPs")
	{
		chatClient.getVIPs(channel).then( response => {
			console.log(response.join());
			var vips = response.join();
			chatClient.say(channel, `Current vips: ${vips}`);
			});

	}
	else
	{
		var formattedMessage = user + " : " + message;
		popPushChat(formattedMessage);
		drawChatHtml();
		asyncClearChatHtml();
	}


});


const listener = await WebHookListener.create(twitchClient, {
    hostName: 'e773e7e6.ngrok.io',
    port: 6969,
    reverseProxy: { port: 443, ssl: true }
})

listener.listen();

const streamChange = await listener.subscribeToStreamChanges(userID, async (stream) => {
	if (stream) {
		console.log("Live");
		chatClient.say(channel,`${stream.userDisplayName} just went live with title: ${stream.title}`);
	} else {
		// no stream, no display name
		console.log("Offline");
		const user = await twitchClient.helix.users.getUserById(userID);
		chatClient.say(channel,`${user.displayName} just went offline`);
	}
});

const newFollower = await listener.subscribeToFollowsToUser(userID, async (stream) => {


	const user = (await stream.userDisplayName)

		chatClient.say(channel,`${user} just followed!`);

		drawAlertHtml('0.8',"birdup","birdup",user, "Just followed!","DarkSalmon"); //opacityVar,gifName,audioName,name,message,color

});


})();

function createAlertHtml(opacityVar,gifName,audioName,name,message,color)
{
var html = 	"<!DOCTYPE html>" + "\n";
html+=	"<html>" + "\n"
html+=	"<head>" + "\n"
html+=	"<meta http-equiv=\"refresh\" content=\"30\">" + "\n"
html+=	"<style>" + "\n"
html +='audio { display:none;}'
html+=	":root {" + "\n"
html+=	"      --poc:" + opacityVar + ";" + "\n"
html+=	"}" + "\n"
html+=	".box {" + "\n"
html+=	"display: inline-flex;"
html+=	"align-items: center;"
html+=	"}" + "\n"
html+="p {" + "\n"
html+=" text-align: center;" + "\n"
html+=" color: black;" + "\n"
html+="  background-color:" +  color + ";" + "\n"
html+="  opacity: var(--poc);" + "\n"
html+=" font-size: 50px;" + "\n"
html+=" font-family: Candara;" + "\n"
html+=" font-variant: normal;" + "\n"
html+=" font-weight: 700;" + "\n"
html+="}"  + "\n"
html+="</style>" + "\n"
html+="</head>" + "\n"
html+="<body>" + "\n"
html+="<div>" + "\n"
html+="<p class=\"box\">\n"
html +=name + "\n";
html += "<img src=\'Images/" + gifName + ".gif\'>"
html += message + "\n";
html += "</p>" +  "\n"
html+="</div>" + "\n"
html += "<audio controls autoplay>" +  "\n"
html += "<source src=\"SoundBoard/" + audioName + ".mp3\" type=\"audio/mpeg\">" +  "\n"
html += "</audio>" +  "\n"
html+="</body>" + "\n"
html+="</html>" + "\n"

return html;
}

function createChatHtml(chat1,chat2,chat3,color1,color2,color3,opacityVar)
{
var html =	"<!DOCTYPE html>" + "\n"
html+=	"<html>" + "\n"
html+=	"<head>" + "\n"
html+= "<link rel=\"stylesheet\" type=\"text/css\" href=\"Stylesheet.css\">"+ "\n"
html+=	"<meta http-equiv=\"refresh\" content=\"30\">" + "\n"
html+=	"<style>" + "\n"
html+=	":root {" + "\n"
html+=	"      --poc:" + opacityVar + ";" + "\n"
html+=	"}" + "\n"

html+="#p01 {" + "\n"
html+=" text-align: left;" + "\n"
html+=" color: black;" + "\n"
html+= "background-image: url(\'icecream.jpg\');";+ "\n"
html+="  opacity: var(--poc);" + "\n"
html+=" font-size: 50px;" + "\n"
html += " font-family: \"Lucida Console\", Courier, monospace;"+ "\n"
html += "  font-weight: bold;"+ "\n"
html+="}"  + "\n"
html+=	"#p02 {" + "\n"
html+=" text-align: left;" + "\n"
html+=" color: black;" + "\n"
html+= "background-image: url(\'smiles.jpg\');";+ "\n"
html+="  opacity: var(--poc);" + "\n"
html+=" font-size: 50px;" + "\n"
html += " font-family: \"Lucida Console\", Courier, monospace;"+ "\n"
html += "  font-weight: bold;"+ "\n"
html+="}"  + "\n"
html+="#p03 {" + "\n"
html+=" text-align: left;" + "\n"
html+=" color: black;" + "\n"
html+= "background-image: url(\'unicorn.png\');";
html+="  opacity: var(--poc);" + "\n"
html+=" font-size: 50px;" + "\n"
html += " font-family: \"Lucida Console\", Courier, monospace;"+ "\n"
html += "  font-weight: bold;"+ "\n"
html+="}"  + "\n"
html+="</style>" + "\n"
html+="</head>" + "\n"
html+="<body>" + "\n"
html += "<div class=\"scroll-left\">"
html+="<p id=\"para1\"></p>" + "\n"
html+="<p id= \"p01\">" + chat1  + "</p>"
html+= "</div>"
html += "<div class=\"scroll-left\">"
html+="<p id= \"p02\">" + chat2  +"</p>"
html+= "</div>"
html += "<div class=\"scroll-left\">"
html+="<p id= \"p03\">" + chat3  +"</p>"
html+= "</div>"
html+="</body>" + "\n"
html+="</html>" + "\n"

return html;
}

function drawAlertHtml(user,message)
{
	var alertArray = message.split(',');
	var htmlWrite = fsfs.createWriteStream(fileNameAlert);
	htmlWrite.once('open', function(fd) {
		var html = createAlertHtml('0.8',"brb","",user,message,'forestgreen'); //opacityVar,gifName,audioName,name,message,color
	  
		htmlWrite.end(html);
	  });	  
	  asyncClearAlertHtml();
}

function clearAlertHtml()
{
	var htmlWrite = fsfs.createWriteStream(fileNameAlert);
	htmlWrite.once('open', function(fd) {
		var html = createAlertHtml('0.0',"","","","",'forestgreen');
	  
		htmlWrite.end(html);
	  });	  

}

function drawChatHtml()
{

	var htmlWrite = fsfs.createWriteStream(fileNameChat);
	htmlWrite.once('open', function(fd) {
		var html = createChatHtml(lastThreeChats[0],lastThreeChats[1],lastThreeChats[2],"Crimson","Olive","SeaGreen" ,'0.8');
		htmlWrite.end(html);
	  });	  
}


function clearChatHtml()
{
	var htmlWrite = fsfs.createWriteStream(fileNameChat);
	htmlWrite.once('open', function(fd) {
		popPushChat("");
		var html = createChatHtml(lastThreeChats[0],lastThreeChats[1],lastThreeChats[2],"Crimson","Olive","SeaGreen" ,'0.8');
	  
		htmlWrite.end(html);
	  });	  
}

function resolveAfter15Seconds() {
	return new Promise(resolve => {
	  setTimeout(() => {
		resolve('resolved');
	  }, 15000);
	});
  }

  function resolveAfter30Seconds() {
	return new Promise(resolve => {
	  setTimeout(() => {
		resolve('resolved');
	  }, 30000);
	});
  }
  
  async function asyncClearAlertHtml() {
	const result = await resolveAfter15Seconds();
	clearAlertHtml();
	// expected output: 'resolved'
  }

  async function asyncClearChatHtml() {
	const result = await resolveAfter30Seconds();
	clearChatHtml();
	// expected output: 'resolved'
  }

  function userIsVIP(user,chatClient,channel)
  {
	  return Boolean(chatClient.getVIPs(channel).then( response =>
		 {

		response.join().includes(user);

		})
		);
  }

  function soundBoard(choice)
  {
	  switch(choice)
	  {
		  case 0:
			var audio = new Audio('/soundBoard/clapping.wav');
			audio.play();
		  break;
	  }
  }

  function popPushChat(message)
  {
	lastThreeChats[2] = lastThreeChats[1];
	lastThreeChats[1] = lastThreeChats[0];
	lastThreeChats[0] = message;


  }
  
