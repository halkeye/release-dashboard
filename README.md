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
