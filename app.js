//require the express nodejs module
var express = require('express'),
	//set an instance of exress
	
    app = express(),
	//require the body-parser nodejs module
	bodyParser = require('body-parser'),
	//require the path nodejs module
	path = require("path"),
	fs = require("fs");
var Finder = require('fs-finder');


'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();

app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true })); 

//tell express that www is the root of our public web folder
app.use(express.static(path.join(__dirname, 'www')));
app.use(express.static(path.join(__dirname, '/../')));
//tell express what to do when the /form route is requested








app.get('/action', function(req, res){
  //process request here and do your db queries
  //then send response. may be json response
	res.setHeader('Content-Type', 'application/json');

 var files = Finder.from(__dirname).lookUp(4).findFiles('config.js');
console.log(files);
  res.json(files);
});



global.configFile = "../config.js";

app.post('/switch',function(req, res){
	res.setHeader('Content-Type', 'application/json');
  global.configFile = req.body.name;
    console.log(configFile);
    var  configPath = path.relative(__dirname,req.body.name);
	console.log(configPath);
 //res.send(configPath);
var obj;
fs.readFile(configPath, 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);
  
res.json(obj);
});
   // res.send(obj);


});






app.post('/form',function(req, res){
	res.setHeader('Content-Type', 'application/json');
	var chunk = '';
    req.on('data', function(data){
        chunk += data; // here you get your raw data.
    })        

    req.on('end', function(){
        //console.log(chunk); //just show in console
        fs.writeFile(configFile, chunk, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 

    })
    res.send("The file was updated!");
	//debugging output for the terminal
});






//wait for a connection
app.listen(3000, function () {
	   Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      //console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log('Gunfigurator is running. Point your browser to: http://'+iface.address+':3000');
    }
    ++alias;
  })
  
})
  var files = Finder.from(__dirname).lookUp(4).findFiles('config.js');
console.log(files);
  //console.log('Gunfigurator is running. Point your browser to: http://localhost:3000');
});
