const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BUILD_DIR = path.resolve(__dirname, '../public');
const APP_DIR = path.resolve(__dirname, '../src');
const VENDOR_DIR = path.resolve(__dirname, '../src/vendor');
const NODE_DIR = path.resolve(__dirname, '../node_modules/');
const context = path.resolve(__dirname, '../');

const config = {
  context: context,
  entry: [APP_DIR + '/index.js'],
  output: {
    path: BUILD_DIR,
    filename: '[name][hash:10].js',
    publicPath:'/',
    chunkFilename:'[name][hash:5].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?/,
        exclude: [NODE_DIR, VENDOR_DIR],
        include: APP_DIR,
        use: [
          {
            loader: 'babel-loader',
            options:{
              presets:['es2015', 'react']
            }
          },
        ],
      },
      {
        test: /\.css$/,
        use:  [
            'style-loader',
            {loader: 'css-loader', options: { importLoaders: 1 }},
            'postcss-loader'
          ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {loader: 'css-loader', options: { importLoaders: 1 }},
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: [
          {
            loader:  'file-loader',
            query: {
              name: '[path][name].[ext]?[hash:8]',
            },
          }
        ]
      },
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          name: '[path][name].[ext]?[hash:8]',
          limit: 10000,
        },
      }
    ],
  },
  resolve:{
    alias:{},
    modules: [
        APP_DIR,"node_modules"
    ]
  },
  plugins:[
    new ExtractTextPlugin('main.css'),
    new HtmlWebpackPlugin({
      template:path.resolve(context, 'public/index.html')
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('dev')
      }
    })
  ],
  devServer: {
    contentBase: 'http://localhost:3002',
    publicPath: '/',
    port: 3002,
    compress: true,
    historyApiFallback: true,
    hot: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    disableHostCheck: true
  }
};

module.exports = config;
