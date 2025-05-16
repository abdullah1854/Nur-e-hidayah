const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname);

module.exports = {
  entry: './index.web.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(appDirectory, 'web-build'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['module:metro-react-native-babel-preset'],
            plugins: ['babel-plugin-react-native-web']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.ttf$/,
        loader: 'url-loader',
        include: path.resolve(__dirname, 'node_modules/react-native-vector-icons')
      }
    ]
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      '@react-native-async-storage/async-storage': path.resolve(__dirname, 'src/services/webStorage.ts'),
      'react-native-sqlite-storage': path.resolve(__dirname, 'src/services/webStorage.ts'),
      'react-native-audio-recorder-player': path.resolve(__dirname, 'src/services/webAudioPlayer.ts'),
      'react-native-vector-icons/MaterialIcons': path.resolve(__dirname, 'src/components/Icon.web.tsx'),
      '../components/Icon': path.resolve(__dirname, 'src/components/Icon.web.tsx')
    },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
    fallback: {
      "crypto": false,
      "fs": false,
      "path": false
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
      'process.env': JSON.stringify(process.env),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    compress: true,
    port: 3001,
    hot: true,
    open: true,
    historyApiFallback: true
  }
};
