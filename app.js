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