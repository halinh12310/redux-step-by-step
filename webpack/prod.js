const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const BUILD_DIR = path.resolve(__dirname, '../public/prod');
const APP_DIR = path.resolve(__dirname, '../src');
const VENDOR_DIR = path.resolve(__dirname, '../src/vendor');
const NODE_DIR = path.resolve(__dirname, '../node_modules/');
const context = path.resolve(__dirname, '../');

const config = {
  context: context,
  entry: [
      'babel-polyfill',
      APP_DIR + '/index.js'
    ],
  output: {
    path: BUILD_DIR,
    filename: '[name][hash:10].js',
    publicPath:'./',
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
              presets: ['es2015', 'react', 'react-optimize'],
              plugins: ['lodash'],
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {loader: 'css-loader', options: { importLoaders: 1 }},
            'postcss-loader',
            'sass-loader'
          ]
        })
      },
      {
        test: /\.json$/,
        use: 'json-loader'
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
    new LodashModuleReplacementPlugin({
      'collections': true,
      'paths': true
    }),
    new ExtractTextPlugin({
      filename: "[name].[hash:5].css",
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      template:path.resolve(context, 'public/index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name:     'vendor',
      filename: 'app.vendor.bundle.js'
    }),
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000}),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })

  ]
};

module.exports = config;
