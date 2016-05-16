var express = require('express');
var morgan = require('morgan');
var session = require('express-session');
var Grant = require('grant-express');
var bodyParser = require('body-parser');


var projects = JSON.parse(process.env.PROJECTS || "[]");

var grant = new Grant({
  server: {
    protocol: 'https',
    state: true,
    callback: '/doneAuth',
    transport: 'session',
    host: process.env.RETURN_HOST
  },
  github: {
    key: process.env.GITHUB_KEY,
    secret: process.env.GITHUB_SECRET,
    scope: ['public_repo', 'repo']
  }
});

var app = express();
app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(session({secret: process.env.EXPRESS_SECRET_TOKEN || 'secret-token'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(grant);

app.get('/', function (req, res) {
  if (!req.session.grant || !req.session.grant.response.access_token) {
    return res.redirect('/connect/github');
  }
  res.render('index.html.ejs', {
    token: req.session.grant.response.access_token,
    projects: projects
  } );
});

app.get('/doneAuth', function (req, res) {
  return res.redirect('/');
});
app.use(express.static('public'));

app.listen(process.env.PORT || 3000);
