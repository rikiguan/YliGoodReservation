const path = require('path');
const {UserscriptPlugin} = require('webpack-userscript');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new UserscriptPlugin({
      headers: {
        name: '打印空闲场地时间段',
        namespace: 'http://tampermonkey.net/',
        version: '0.1',
        description: '打印一天内所有空闲场地的时间段',
        author: 'Copilot',
        match: '*://*/*',
        grant: 'none'
      },
      proxyScript: {
        filename: '[name].proxy.user.js',
        enabled: false
      },
      pretty: true
    })
  ]
};
