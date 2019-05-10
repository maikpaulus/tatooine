const path = require('path');
const webpack = require('webpack');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

process.traceDeprecation = true;

module.exports = {
    mode: process.env.NODE_ENV,
    context: path.resolve(__dirname, './client'),
    entry: {
        app: './App.js'
    },
    
    output: {
        path: path.resolve(__dirname, './public/assets/js'),
        publicPath: 'public/assets/js',
        filename: '[name].min.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.s(a|c)ss$/,
                loader: 'style-loader!css-loader!sass-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.jpg$/,
                loader: 'url-loader',
                exclude: /public/
            }
        ]
    },

    plugins: [
        new VueLoaderPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],

    optimization: {
        minimizer: [
          new UglifyJsPlugin({
            extractComments: true,
            cache: true,
            parallel: true
          })
        ],
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    filename: 'vendors.min.js',
                    chunks: 'all'
                }
            }
        }
    }
}