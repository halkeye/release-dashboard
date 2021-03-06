const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'source-map',
  output: {
    filename: '[name].bundle.js'
  },
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: 'production' })
  ]
});
