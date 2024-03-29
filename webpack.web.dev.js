const { merge } = require('webpack-merge');
const config = require('./webpack.config')

module.exports = merge(config, {
  entry: './src/app.ts',
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  output: {
    filename: 'app.js',
  }
});