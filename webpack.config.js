const path = require('path');
const webpack = require('webpack');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BabiliPlugin = require('babili-webpack-plugin');

process.traceDeprecation = true;

module.exports = {
    mode: process.env.NODE_ENV,
    context: path.resolve(__dirname, './client'),
    entry: {
        app: './App.ts'
    },
    
    output: {
        path: path.resolve(__dirname, './public/assets/js'),
        publicPath: 'public/assets/js',
        filename: '[name].min.js'
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "ts-loader",
                options: {
                  appendTsSuffixTo: [/\.vue$/]
                }
              },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    esModule: false,
                }
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

    resolve: {
        extensions: ['.ts', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
        }
    },

    plugins: [
        new VueLoaderPlugin(),
        /* new BabiliPlugin(), */
    ],
}