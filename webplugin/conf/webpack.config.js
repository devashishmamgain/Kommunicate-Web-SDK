const path = require("path");
const fs = require('fs');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeModules = {};


fs.readdirSync(path.resolve(__dirname, '../node_modules'))
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });


module.exports = {
  entry: "./src/app.js", 
  externals: nodeModules,
  plugins: [
    new CleanWebpackPlugin(['dist'])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  output: {
    filename: "./build/kommunicatePlugin.js",
    //publicPath:"./build/assets"
  }
}