var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-source-map',
  entry: './src/js/app.js',
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: 'js/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: [
          'babel'
        ],
        exclude: /node_modules|bower_components/
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css',
          'postcss'
        ]
      },
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css',
          'sass'
        ]
      },
      {
        test: /\.less$/,
        loaders: [
          'style',
          'css',
          'less'
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    //new webpack.ContextReplacementPlugin(/moment[\\\/]lang$/, /^\.\/(en)$/),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ]
}
