const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssets = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const devMode = process.env.NODE_ENV === 'production';
 
module.exports = {
    entry : './src/index.js',
    output : {
        filename : 'bundle.js',
        path : path.resolve(__dirname, './public')
    },
    
     stats: {
        entrypoints: false,
        children: false
     },
    module : {
        rules : [
            {
              test: /\.s?[ac]ss$/,
              use: [
                  MiniCssExtractPlugin.loader,
                  { loader: 'css-loader', options: { sourceMap: true } },
                  { loader: 'postcss-loader'},
                  { loader: 'sass-loader', options: { sourceMap: true } },
              ],
            },
            {
              test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
              use: [{
                loader: 'file-loader',
                options: {
                    name: '[hash].[ext]',
                    outputPath: 'fonts/'
                }
              }]
            },
            {
              test: /\.html$/,
              use: ['html-loader']
            },
            {
              test: /\.(svg|png|jpg|gif)$/,
              use: {
                loader:'file-loader',
                options:{
                    name:'[hash].[ext]',
                    outputPath:'img/'
                }
              }
            },
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: "babel-loader"
            },
        ]
    },
    devtool: 'source-map',
    optimization: {
      minimizer: [
          new TerserPlugin({
              extractComments: true,
          }),
      ],
    },
    
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
          filename: "styles.css"
        }),
        new OptimizeCSSAssets({}),
        new HtmlWebpackPlugin({
          template: './src/index.html'
        })

    ],
    mode : devMode ? 'development' : 'production'
};