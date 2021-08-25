
//// Initiatlize an NPM project and Require a few more libraries that will require installation:
/*
npm init -y
npm install dotenv
npm install express
npm install ws
*/

const {ConnectionString} = require('connection-string');

//// Require the db tools
//const db = require('./db/db');

const path = require('path');
require('dotenv').config()
const PORT = process.env.PORT || 3000;
const express = require('express');
const socks = require('ws').Server;


//// Now create and start up a server instance with express, with a few specifications:
const server = express()
	//// Use ejs
	.set('view engine', 'ejs')
	//// We'll also use the /public directory as a static folder
	//// Anything that goes to /public/whatever. will just serve up whatever.file
	//// This is useful for using external JS and CSS in our index.html file, for example
	//// And finally, let's listen on our PORT so we can visit this app in a browser
	.use('/public', express.static('public'))
	.use(express.urlencoded({extended:true}))
	//// Specify a 'get' route for the homepage:
	.get('/', function(req, res){
		//// We'll just be serving up the index.html that's in the 'public' folder
//		res.sendFile(path.join(__dirname, 'public/index.html'));
		res.render('index', {});
	})
	//// Handle chat/room/user path
	.get('/monitor/:id', function(req, res) {
		res.render('monitor', {
			bpm_id: req.params.id.trim()
		})
	})
/*
	.get('/test', function(req, res) {
		var c = new ConnectionString(process.env.CLEARDB_DATABASE_URL);
		res.json(c);
	})
	.get('/dbSetup', function(req, res) {
		var query = "\
		CREATE TABLE IF NOT EXISTS nonnychat_messages ( \
				id int not null auto_increment primary key \
				, username varchar(50) \
				, roomname varchar(200) \
				, messagetext text \
				, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP \
			); \
		";
		db.query(query, (err, results, fields) => {
			console.log(results);
		});
		res.send(query);
	})
	//// Handle chat/room/user path
	.get('/chat/:chatroom/:username', function(req, res) {
		res.render('index', {
			chatroom: req.params.chatroom
			, username: req.params.username
		})
	})
	////___ Submit a message to a chat room as a POST
	.post('/chat/:chatroom', function(req, res) {
		var message = req.body.message;
		var username = req.body.username;
		message = db.clean(message);
		var query = "\
		INSERT INTO nonnychat_messages ( username, roomname, messagetext) VALUES ('"+username+"', '"+req.params.chatroom+"', '"+message+"');";
		db.query(query, (err, results, fields) => {
			if (err) {
//				console.log("ERROR: ", err);
			} else {
//				console.log("RESULTS: ", results);
			}
		});
		res.send(query);
	})
	////___ Retrieve a chat room's messages as a GET
	.get('/chat/:chatroom', function(req, res) {
		var query = "DELETE FROM nonnychat_messages WHERE (roomname = '"+req.params.chatroom+"') AND (created_at < (NOW() - INTERVAL 2 MINUTE))";
//		console.log(query);
		db.query(query, (err, results, fields) => {
		});
		var query = "\
		SELECT * FROM nonnychat_messages WHERE roomname = '"+req.params.chatroom+"'";
		db.query(query, (err, results, fields) => {
			if (err) {
				res.json(err);
			} else {
				res.json(results);
			}
		});
	})
*/
	//// Finally start to listen on our selected port
	.listen(PORT, () => console.log("Listening on PORT " + PORT))
	;




const wss = new socks({ server });
wss.on('connection', (ws) => {
	ws._data = {}
	ws.on('close', () => console.log('Client disconnected'));
	ws.on('message', message => {
		let mdata = JSON.parse(message);
		/*
		if (mdata.action=="chatmsg") {
		    wss.clients.forEach((ws) => {
				if (ws._data.room == mdata.room) {
			        let m = {action:"chatmsg", content: {
						message: mdata.message, username: mdata.username, timestamp: (new Date()).toTimeString()
					}};
				//	console.log(m);
			        ws.send(JSON.stringify(m));
				}
		    });
		}
		*/
		if (mdata.action=="init") {
			console.log(mdata.message);
            var m = {action:"log", content:"Welcome!"};
			ws.send(JSON.stringify(m));
		}
		if (mdata.action=="bpm") {
			console.log("bpm received from browser: ", mdata.bpm);
            var m = {action:"bpm", bpm:mdata.bpm};
//            var m = {action:"log", content:"bpm received from websocket: " + mdata.bpm};
			ws.send(JSON.stringify(m));
		}
	})
})
