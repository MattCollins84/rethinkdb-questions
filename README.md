# rethinkdb-questions

This is a sample app that shows off the power of changefeeds in [RethinkDB](http://www.rethinkdb.com).

It is a simple question & answer app that will allow users to add questions, up and down vote questions, and allow an administrator to answer them.

## Installation
Ther are a few small steps required to get up and running.

### RethinkDB

By default, this app uses a local RethinkDB instance - you will need to [install and run it yourself](https://www.rethinkdb.com/docs/install/).

If you are using Homebrew on a Mac, you can use `brew install rethinkdb`.

Once installed you can run RethinkDB by simply typing `rethinkdb` at your terminal.

Once up and running you will need to create a `questions` table inside the default `test` database. You can do this via the RethinkDB admin UI which should be running at `http://localhost:8080`. Go via the `Table` menu option from the navigation at the top of the page.

### Node.js

You will also need [Node.js](http://www.nodejs.org) installed. I used `v4.4.5` so as long as you're at that version you should be fine.

Once you have Node installed, `npm install` should get you the rest of the way.

To start the app, `node app.js`, and you should see the URL that you can use to access it displayed in the output. It will look something like `http://localhost:6001`.

## The App

The app itself is designed to be used with an audience, and is very simple.

Ask a question via the button in the top right. Each question can be up or down voted and the questions will re-order themselves based on their current score.

If you are accessing this app via the homepage you will not be able to answer any questions, but if you access the app via the `/answer` endpoint, you should be able to answer questions individually.

Every connected user should see updates as questions get added, voted on, and answered.