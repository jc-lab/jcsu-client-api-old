const webpack = require('webpack');
const path = require('path');

module.exports = {
    target: 'node',
    mode: 'production',
    entry: {
        main: './src/index.ts'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs2'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            '@src': path.resolve(__dirname, 'src')
        }
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    optimization: {
        minimize: false
    }
};
