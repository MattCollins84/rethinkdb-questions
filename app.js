/*****
	Express and Socket.IO
*****/
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const cfenv = require('cfenv');
const	appEnv = cfenv.getAppEnv()
const async = require('async');

/*****
	Bodyparser etc... for POST requests
*****/
const bodyParser = require('body-parser');
const bpJSON = bodyParser.json();
const bpUrlencoded = bodyParser.urlencoded({ extended: true});

/*****
	Find IP info
*****/
const publicIP = appEnv.url || require('internal-ip').v4() + ":3000";

/*****
	RethinkDB
*****/
const r = require("rethinkdb");
//console.log(require('./lib/credentials.js'));
// Local connection Object
// const connection = {
// 	db: "questions"
// }

// Compose connection Object
// const connection = {
//   host: "sl-eu-lon-2-portal.2.dblayer.com",
//   port: 15106,
//   user: "admin",
//   password: "OiupKl-_yd__b5jP1vdgcAFw0_rYIMaslr0byh3N7Dc",
//   ssl: {
//     ca: new Buffer(fs.readFileSync('./cert.ca', "utf8"))
//   },
// 	 db: "nottsjs"
// }

// const connection = {
//   host: "bluemix-sandbox-dal-9-portal.2.dblayer.com",
//   port: 15408,
//   user: "admin",
//   password: "q3rlQtyhP5xZQMy3Qp6h_byv4zko98RYsbm0-P7HKi0",
//   ssl: {
//     ca: new Buffer("LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURoVENDQW0yZ0F3SUJBZ0lFVit1VStUQU5CZ2txaGtpRzl3MEJBUTBGQURCRU1VSXdRQVlEVlFRREREbDEKZDJVdVptRnpjMjVoWTJoMFFHUmxMbWxpYlM1amIyMHRNbVk1T0dNek9ESTVPRGM1TlRCbU1XUTRNR05oTkRJeApOVEJtWkRVMU4yTXdIaGNOTVRZd09USTRNVEF3TVRJNVdoY05Nell3T1RJNE1UQXdNREF3V2pCRU1VSXdRQVlEClZRUURERGwxZDJVdVptRnpjMjVoWTJoMFFHUmxMbWxpYlM1amIyMHRNbVk1T0dNek9ESTVPRGM1TlRCbU1XUTQKTUdOaE5ESXhOVEJtWkRVMU4yTXdnZ0VpTUEwR0NTcUdTSWIzRFFFQkFRVUFBNElCRHdBd2dnRUtBb0lCQVFDegpYQ0czSGIwUTNVSUJzelF1eHlnaXZsV20vTUY3RWZaY2NIZXl5bjVCZjVBNkpRclBxZ3JyaXJpbmtOOFo0STUrCm12OWZCMUh6T2hBZFJQQzZNSjlRVDU3bUhSRVh4SENtbHJCaXZjZFA0WS9nMVM4T0Z1MW5QbHlYM1ZnMjNITWsKRVlVNVBtaVdmVTlNaEt5bjZyNmpSRHJKcmt4d3IwWUxJbVhPTTN1UWs5aUFHY2JQY0cyU2VWYW1qNXhPcjFRbApUdHRpNWNtSWhCbUc3REF4WGdDQTNXZnIvVlRZU1d5S3lvUlpOZnVJUko0NWswM1l2TFdHVlo0TjBYS0d3dVpyCmcxMmFXckF2OU1COW5uM3Bqa0kxTTh6bmZhMzMwazRnMHhqVFZ4Z2orNVJZUjZhY0V2cWVwK092TUpVSHY5M1QKUFpHek5vREFRRkRSb0VqMEdjakxBZ01CQUFHamZ6QjlNQjBHQTFVZERnUVdCQlJNWDZWYm81SFZMN2JONHp0dwpkTHd6V3lMWjJqQU9CZ05WSFE4QkFmOEVCQU1DQWdRd0hRWURWUjBsQkJZd0ZBWUlLd1lCQlFVSEF3RUdDQ3NHCkFRVUZCd01DTUF3R0ExVWRFd1FGTUFNQkFmOHdId1lEVlIwakJCZ3dGb0FVVEYrbFc2T1IxUysyemVNN2NIUzgKTTFzaTJkb3dEUVlKS29aSWh2Y05BUUVOQlFBRGdnRUJBRmZrYmF1WXBrQnplcDlCbWY3SFVEZFFDc2FQampOWApKWW01T3hkdWdUNGlqU0JSbkNDeW9VMWJWK2FMdm5WczBqSXJVUGlHU1A0K21FQjYwS2xJaTRBZUQvWXVJbUZ6Ck9TT29oejg4SUxoMmRWZHBORkVpcERDOVhuZ0w0QlUrNWZEOE1zQVdTaC9sd1F0ZWRzcjNZZjlIZkk3RW50bjEKd1FXTzgzaG1xSXVTbHBaclNPUnl6Y0YzbVZPR2xkZklYcEpQcXZPUXdiMVVDM05Tc0tVeGExVFFENDcvZDNISQpwd2VzaG15ZFpMdzFuaDNtU0szMHdLYmFlQTJqbklZcUhCL3lGcGUrTUFIMDBxZGFUYXRqd3FKRks2TVpuTjJ0CjJmTDdiWlQ4OGxmeGprcHRGdlNiRjNEcjh4SWxrYjRuYnNNekVLNjZORDVZSVBaU0wwZWpOSVk9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K", "base64").toString("utf-8")
//   }
// }

const connection = require('./lib/credentials.js');

/*****
	API endpoints
*****/

// Get the public IP (just for convenience)
app.get("/ip", (req, res) => {
	return res.send({ip: publicIP})
})

// Create a new question
app.post("/question", bpJSON, bpUrlencoded, (req, res) => {

	var question = {
		question: req.body.question,
		score: 1,
		answer: ""
	}

	r.connect(connection, function(err, conn) {

		r.table("questions").insert(question).run(conn, (err, cursor) => {

			conn.close();
			
			if (err) {
				return res.status(404).send({ success: false })
			}

			return res.send({ success: true })

		});

	})

})

// Get all questions
app.get("/questions", (req, res) => {

	r.connect(connection, (err, conn) => {
		
		r.table("questions").run(conn, (err, cursor) => {

			cursor.toArray((err, results) => {

				conn.close();
				return res.send(results);

			})

		});

	})

})

// Upvote a question
app.post("/upvote/:id", (req, res) => {

	r.connect(connection, (err, conn) => {

		// get by ID
		// update score to score+1
		// default of 1 if no score set
		r.table("questions").get(req.params.id).update({
		   score: r.row("score").add(1).default(1)
		}).run(conn, (err, cursor) => {

			conn.close();

			if (err) {
				return res.status(404).send({ success: false })
			}

			return res.send({ success: true })

		});

	})

})

// downvote a question
app.post("/downvote/:id", (req, res) => {

	r.connect(connection, (err, conn) => {

		// get by ID
		// update score to score-1
		// default of 0 if no score set
		r.table("questions").get(req.params.id).update({
		   score: r.row("score").sub(1).default(0)
		}).run(conn, (err, cursor) => {

			conn.close();

			if (err) {
				return res.status(404).send({ success: false })
			}

			return res.send({ success: true })

		});

	})

})

// Answer a question
app.post("/answer/:id", bpJSON, bpUrlencoded, (req, res) => {

	r.connect(connection, (err, conn) => {

		// get by ID
		// update answer
		r.table("questions").get(req.params.id).update({
		   answer: req.body.answer
		}).run(conn, (err, cursor) => {

			conn.close();

			if (err) {
				return res.status(404).send({ success: false })
			}

			return res.send({ success: true })

		});

	})

});

/*****
	FRONT END
*****/
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/answer', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/graph', (req, res) => {
  res.sendFile(__dirname + '/public/graph.html');
});





r.connect(connection, (err, conn) => {

	var actions = {

		/*****
			Check for existing db
			- create if not present
		*****/
		questionsDB: function(callback) {

			r.dbList().contains('questions')
		  .do(function(dbExists) {
		    return r.branch(
		      dbExists,
		      { dbs_created: 0 },
		      r.dbCreate('questions')
		    );
		  }).run(conn, (err, cursor) => {
		  	return callback()
		  })

		},

		/*****
			Check for existing tables
			- create if not present
		*****/
		questionsTable: function(callback) {

			r.tableList().contains('questions')
		  .do(function(tableExists) {
		    return r.branch(
		      tableExists,
		      { tables_created: 0 },
		      r.tableCreate('questions')
		    );
		  }).run(conn, (err, cursor) => {
		  	return callback()
		  })

		}

	}

	async.series(actions, (err, results) => {

		/*****
			Monitor the questions table for any changes
			- new
			- deleted
			- updated
		*****/
		r.table("questions").changes().run(conn, (err, cursor) => {

			// for each update emit the data via Socket.IO
			cursor.each((err, item) => {
				
				if (err) return;

				// new
				if (item.old_val === null && item.new_val !== null) {
					io.emit('new', item.new_val)
				}

				// deleted
				else if (item.old_val !== null && item.new_val === null) {
					io.emit('deleted', item.old_val)
				}

				// updated
				else if (item.old_val !== null && item.new_val !== null) {
					io.emit('updated', item.new_val)
				}

			});

		});

	})

});

// serve static files from /public
app.use(express.static(__dirname + '/public'));

/*****
	Listening
*****/
http.listen(appEnv.port, ( appEnv.bind == "localhost" ? null : appEnv.bind), () => {
  console.log(`listening on ${appEnv.url || publicIP}`);
});