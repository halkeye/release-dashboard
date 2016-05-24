# release-dashboard

A simple web app to show the latest tag (release) of various git repos.

## Configuration

Setup a bunch of env variables. Use `heroku config:set` on heroku, or simple export/set locally

* `RETURN_HOST` - Hostname to redirect to for oauth purpose
* `GITHUB_KEY`/`GITHUB_SECRET` - Github application client key and secret (https://github.com/settings/developers)
* `EXPRESS_SECRET_TOKEN` - Session "random" key
* `CONFIG_REPO` - Repo to use with configuration, EX. 'saucelabs/release-dashboard-config' must have a config.json in the root directory

## config.json

Currently supports 2 formats. `tag` being set, and `tag` being unset:
* `tag` === null - Will grab the latest tag returned by github api
* `tag` !== null - Returns the last commit with that tag

```
{
  "repos": [
    { "repo": "owner/repo", "tag": "deployed-latest" },
    { "repo": "owner/repo2" }
  ]
}
```

You can also add the `deployTargetInterval` key to say how often you desire to deploy this project. The project's card will then slowly fade from green to red if you don't deploy as often as you want, to let you know you have a stale release!

```
{
  "repos": [
    { "repo": "owner/repo", "deployTargetInterval": 1 },
    { "repo": "owner/repo", "deployTargetInterval": 0.5 },
    { "repo": "owner/repo", "deployTargetInterval": 3 },
    { "repo": "owner/repo", "deployTargetInterval": false }
  ]
}
```

The unit is 'once every X days', so the first repo in the list wants to be deployed once a day. The second wants to be deployed twice a day (every `0.5` days), and the third wants to be deployed once every 3 days. The last project is opting out of the deploy target interval feature entirely!

## Dev

Run the server

```
# get deps
npm install

# run this in one terminal to watch for changes and recompile
$(npm bin)/webpack -d -w

# start the server in another terminal. Make sure to have your config exported!
npm start
```
