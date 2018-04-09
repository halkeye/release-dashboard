const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'source-map',
  output: {
    filename: '[name].[chunkhash].bundle.js'
  },
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: 'production' })
  ]
});
