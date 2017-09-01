const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let config = require('./dev');

module.exports = function (config) {
  config.plugins = [
    new BundleAnalyzerPlugin()
  ]
  return config
}(config)
