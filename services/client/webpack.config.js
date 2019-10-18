const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index_bundle.js'
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: 'babel-loader' },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] }
    ]
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_USERS_SERVICE_URL': JSON.stringify(process.env.REACT_APP_USERS_SERVICE_URL),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
}