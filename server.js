// Formats the request body from POST, PUT, PATCH and puts them on the `req.body` property.
var bodyParser = require('body-parser');
// CORS allows for cross-origin requests, making our API available across multiple HTTP origins/hosts.
// var cors = require('cors');
var express = require('express');
var passport = require('passport');
var lowdb = require('lowdb');
var uuid = require('uuid');

var lineart = require('./lineart.json');

var LocalStrategy = require('passport-local').Strategy;

var db = lowdb('db.json', {
    storage: require('lowdb/lib/file-sync')
});

db.defaults({
    users: [
        {
            id: uuid(),
            username: 'admin',
            password: 'admin'
        }
    ],
    pages: []
}).value();

// Add lineart from the JSON file.
db.set('lineart', lineart).value();

passport.use(new LocalStrategy(function (username, password, cb) {
    // Find the user
    var user = db.get('users')
        .find({ username: username })
        .value();
    // If no user was found, or the password was incorrect
    if (!user || user.password !== password) {
        return cb(null, false);
    }
    // User was found
    return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

var app = express();

app.use(require('body-parser')());
app.use(require('express-session')({
    secret: 'honey badger don\'t care',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/build'));

// API endpoints are authenticated with this function. (Not all endpoints need to be authenticated.) If the client recieves a 401 response (unauthorized), it can redirect itself to the login page.
function auth(req, res, next) {
    if (!req.isAuthenticated()) {
        res.sendStatus(401);
    } else {
        next();
    }
}

/**
 * Authentication endpoints
 */

// logs the user in
app.post('/auth/login', passport.authenticate('local', {
    failureRedirect: '/'
    // every request gets a user property
}), function (req, res) {
    res.json(req.user);
});

// logs the user out
app.delete('/auth/login', auth, function (req, res) {
    req.logOut();
    res.sendStatus(202);
});

// gets the current user
app.get('/auth/check', auth, function (req, res) {
    res.json(req.user);
});

/**
 * REST API endpoints
 */

// get a list of all users
app.get('/users', auth, function (req, res) {
    var users = db.get('users').value();
    res.json(users);
});

app.post('/users', function (req, res) {
    var existing = db.get('users')
        .find({ username: req.body.username })
        .value();

    if (existing) {
        res.sendStatus(409);
        return;
    }

    var user = {
        id: uuid(),
        username: req.body.username,
        password: req.body.password
    };

    db.get('users')
        .push(user)
        .value();

    res.json(user);
});

app.get('/users/:id', auth, function (req, res) {
    var user = db.get('users')
        .find({ id: req.params.id })
        .value();

    if (!user) {
        res.sendStatus(404);
        return;
    }

    res.json(user);
});

app.get('/lineart', auth, function (req, res) {
	// Get all lineart objects
	var lineart = db.get('lineart').value();
	res.json(lineart);
});

app.get('/lineart/:id', auth, function (req, res) {
	// Get a single lineart object
	var linedrawing = db.get('lineart')
		.find({ id: req.params.id })
		.value();

	res.json(linedrawing);
});

app.get('/users/:id/pages', auth, function (req, res) {
	var pages = db.get('pages').filter(function (page) {
		// returns true or false:
		return req.params.id === page.userId;
	});

	res.json(pages);
});

app.post('/users/:id/pages', auth, function (req, res) {
	// Create a page
	var newPage = {
		id: uuid(),
		userId: req.params.id,
		title: req.body.title,
		objects: []
	};

	db.get('pages')
		.push(newPage)
		.value();

	res.json(newPage);
});

app.get('/users/:userId/pages/:pageId', auth, function (req, res) {
    // Get a single page
    var page = db.get('pages')
        .find({ id: req.params.pageId })
        .value();

    res.json(page);
});

app.put('/users/:userId/pages/:pageId', auth, function (req, res) {
	// Update a single page
    var update = {
        userId: req.params.userId,
        title: req.body.title,
        objects: []
    };

    db.get('pages')
        .find({ id: req.params.pageId })
        .assign(update)
        .value();

    res.json(update);
 
});

app.listen(8000);


// GET (app.get()) individual drawings, pages

// each lineart object will have a svg (document) in the form of a string - storing the string in the json database like this:

// '<svg width="100" height="100">
//   <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
// </svg>'

// id, svg, title, array of modeNames

// modes will be classes