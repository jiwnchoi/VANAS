const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index : './src/index.js',
    overview : './src/overview.js'
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname + "/build")
  },
  mode: "none",
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      hash : true,
      chunks : ['index'],
			template: './public/index.html', 
      filename: 'index.html'
    }),
    new HtmlWebPackPlugin({
      hash : true,
      chunks: ['overview'],
			template: './public/overview.html', 
      filename: 'overview.html'
    })
  ]
};