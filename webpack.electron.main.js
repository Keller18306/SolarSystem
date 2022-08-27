const CopyPlugin = require("copy-webpack-plugin");
const { merge } = require('webpack-merge');
const config = require('./webpack.config')

module.exports = merge(config, {
  entry: './src/electron.ts',
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css', '.json'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "dist" },
      ]
    })
  ]
});