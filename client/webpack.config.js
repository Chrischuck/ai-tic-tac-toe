const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = {
  resolve: {
    modules: ['src', 'node_modules']
  },
  devtool: 'source-map',
  entry: {
    vendor: ['@babel/polyfill', 'react', 'react-dom'],
    client:     './src/index.js',
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].chunkhash.bundle.js',
    chunkFilename: '[name].chunkhash.bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
     ]
  },
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'GoWasm!',
      template: './src/index.html',
      filename: './index.html',
      inject: true,
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        minifyCSS: true,
        minifyURLs: true,
        minifyJS: true,
        removeComments: true,
        removeRedundantAttributes: true
      }
    }),
    // Make sure to add these in this order, so the wasm_exec.js gets injected first
    // yes, it's backwards, I know :/
    new AddAssetHtmlPlugin({ filepath: require.resolve('./src/init_go.js') }),
    new AddAssetHtmlPlugin({ filepath: require.resolve('./src/wasm_exec.js') })
  ]
};