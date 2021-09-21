const fsfs= require('fs');

var fileNameGif = 'gifAlert.html';

drawGif('0.8',"birdup","birdup","GUYXXX69PROGAMER","just followed!","DarkSalmon");

function createHtml(opacityVar,gifName,audioName,name,message,color)
{
var html = 	"<!DOCTYPE html>" + "\n";
html+=	"<html>" + "\n"
html+=	"<head>" + "\n"
html+=	"<meta http-equiv=\"refresh\" content=\"30\">" + "\n"
html+=	"<style>" + "\n"
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

function drawGif(opacityVar,gifName,audioName,name,message,color)
{

	var htmlWrite = fsfs.createWriteStream(fileNameGif);
	htmlWrite.once('open', function(fd) {
		var html = createHtml(opacityVar,gifName,audioName,name,message,color);
		htmlWrite.end(html);
	  });	  
}