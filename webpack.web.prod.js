const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
    entry: './src/app.ts',
    mode: 'production',
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "dist" },
            ]
        })
    ],
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'build'),
        clean: true
    }
});