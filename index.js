var express = require('express');
var morgan = require('morgan');
var session = require('express-session');
var Grant = require('grant-express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var grant = new Grant({
  server: {
    protocol: 'https',
    state: true,
    callback: '/doneAuth',
    transport: 'querystring',
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
app.use(cookieParser());
app.use(session({secret: process.env.EXPRESS_SECRET_TOKEN || 'secret-token'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(grant);
if ((process.env.NODE_ENV || 'development') === 'development') {
  const config = require('./webpack.config.js')();
  const compiler = require('webpack')(config);
  const webpackDevMiddleware = require('webpack-dev-middleware');
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: { colors: true }
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

app.get('/', function (req, res) {
  // Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)
  if (req.headers['user-agent'].startsWith('Slackbot-LinkExpanding')) {
    return res.render('slackbox.html.ejs');
  }
  const token = req.cookies['gh-token'] || process.env.GITHUB_TOKEN;

  if (!token) { return res.redirect('/connect/github'); }
  res.render('index.html.ejs', {
    token: token,
    config_repo: process.env.CONFIG_REPO
  });
});

app.get('/doneAuth', function (req, res) {
  const token = req.param('access_token');
  if (!token) { return res.redirect('/connect/github'); }
  res.cookie('gh-token', token, { path: '/' });
  return res.redirect('/');
});
app.use(express.static('public'));

app.listen(process.env.PORT || 3000);
