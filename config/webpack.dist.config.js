const webpack = require('webpack');
const path    = require('path');
const config  = require('./webpack.config');

config.output = {
  filename: '[name].bundle.js',
  publicPath: '',
  path: path.resolve(__dirname, '../dist')
};

config.plugins = config.plugins.concat([

  new webpack.optimize.UglifyJsPlugin({
    mangle: {
      //压缩时保留的关键字
      except: ['$', 'exports', 'require', 'angular','echarts']
    }
  })
]);

module.exports = config;
