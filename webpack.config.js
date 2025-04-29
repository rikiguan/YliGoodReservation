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
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new UserscriptPlugin({
      headers: {
        name: 'YliGoodReservation',
        namespace: 'http://tampermonkey.net/',
        version: '0.1',
        description: 'help u get a place 2 play',
        author: 'riki',
        match: '*://ggtypt.nju.edu.cn/*',
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
