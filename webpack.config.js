const path = require('path');
const webpack = require('webpack');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin')
const DotenvWebpackPlugin = require('dotenv-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const NodemonWebpackPlugin = require('nodemon-webpack-plugin');

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new FaviconsWebpackPlugin(path.resolve(__dirname, 'src/images/logo_sm.png')),
    new DotenvWebpackPlugin({
      systemvars: true
    }),
    new HTMLWebpackPlugin({
      title: 'FilmFights',
      template: 'src/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new SWPrecacheWebpackPlugin({
      cacheId: 'FilmFights',
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      minify: true,
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
    new NodemonWebpackPlugin({
      script: 'server.js',
      watch: './dist',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.mp3/,
        use: [{
          loader: 'url-loader',
          options: {
            name: 'sounds/[hash]-[name].[ext]',
          },
        }],
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
              limit: 8000, // Convert images < 8kb to base64 strings
              name: 'images/[hash]-[name].[ext]'
          }
        }]
      }
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: '0.0.0.0',
  },
};
