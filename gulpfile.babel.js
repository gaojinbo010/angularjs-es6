import gulp from 'gulp';
import webpack from 'webpack';
import path from 'path';
import sync from 'run-sequence';
import rename from 'gulp-rename';
import lodash from 'lodash';
import gutil from 'gulp-util';
import browserSync from 'browser-sync';
import del from 'del';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import colorsSupported from 'supports-color';
import historyApiFallback from 'connect-history-api-fallback';

let root = 'src';
//根组路径app/{glob}
let resolveToApp = (glob = '') => {

  return path.join(root, 'app', glob);
};
//组件路径app/components/{glob}
let resolveToComponents = (glob = '') => {

  return path.join(root, 'app/components', glob);
};

//.css .scss .html .js 路径定义
let paths = {
  scss: resolveToApp('**/*.scss'),
  html: [
    resolveToApp('**/*.html'),
    path.join(root, 'index.html')
  ],
  entry: [
    'babel-polyfill',
    path.join(__dirname, root, 'app/app.js')
  ],
  output: root,
  dest: path.join(__dirname, 'dist')
};

//打包任务
gulp.task('webpack', ['clean'], (cb) => {
  const config = require('./config/webpack.dist.config');
  config.entry.app = paths.entry;

  webpack(config, (err, stats) => {
    if (err) {
      throw new gutil.PluginError("gulp webpack error : ", err);
    }

    gutil.log("[webpack]", stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: true
    }));

    cb();
  });
});

//开发模式
gulp.task('serve', () => {

  const config = require('./config/webpack.dev.config');

  //热更替中间件 browser-sync服务器需要
  config.entry.app = [
    'webpack-hot-middleware/client?reload=true',
  ].concat(paths.entry);

  //仪表盘设置
  const Dashboard = require('webpack-dashboard');
  const DashboardPlugin = require('webpack-dashboard/plugin');
  const dashboard = new Dashboard();
  config.plugins.push(new DashboardPlugin(dashboard.setData));

  var compiler = webpack(config);
  // compiler.apply(new DashboardPlugin());

  //browser-sync服务器  webpack-dev-middleware + webpack-hot-middleware实现热更替
  browserSync({
    port: process.env.PORT || 3000,
    open: false,
    server: { 
      baseDir: root 
    },
    middleware: [
      historyApiFallback(),
      //webpack dev middleware不会一直写入磁盘 先存储在记忆区(缓冲区?)
      webpackDevMiddleware(compiler, {
        stats: {
          colors: colorsSupported,
          chunks: false,
          modules: false
        },
        publicPath: config.output.publicPath
      }),

      webpackHotMiddleware(compiler)
    ]
  });
});

//清理打包文件
gulp.task('clean', (cb) => {
  del([paths.dest]).then(function (paths) {
    gutil.log("[clean]", paths);
    cb();
  })
});
