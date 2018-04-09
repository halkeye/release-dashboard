'use strict';
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');

const sourcePath = path.join(__dirname, './src');
const distPath = path.join(__dirname, './public');

module.exports = {
  devtool: 'eval',
  context: sourcePath,
  entry: { js: ['js/app.js'] },
  output: {
    path: distPath,
    filename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          name: 'vendor',
          test: /node_modules/
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.less/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
      {
        test: /\.(html)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
              attrs: ['img:src', 'link:href', 'link:href']
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          {
            loader: 'image-webpack-loader',
            options: {
              gifsicle: {
                interlaced: false
              },
              optipng: {
                optimizationLevel: 7
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              mozjpeg: {
                progressive: true,
                quality: 65
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader?url=false']
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    modules: [path.resolve(__dirname, 'node_modules'), sourcePath]
  },

  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.ProvidePlugin({
      fetch:
        'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      allChunks: true
    })
  ],

  stats: {
    colors: {
      green: '\u001b[32m'
    }
  },

  devServer: {
    contentBase: './src',
    historyApiFallback: true,
    port: 3000,
    compress: false,
    inline: true,
    hot: true,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m'
      }
    }
  }
};
