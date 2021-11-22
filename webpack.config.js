const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");


module.exports = {
  entry: {
    index : './src/index.js',
  },
  devServer : {
    static : path.resolve(__dirname),
    client : {
      overlay: false
    }
    
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname + "/build"),
  },
  mode: "none",
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.js$/,
        exclude: /node_modules/, 
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], 
            "plugins": ["@babel/plugin-transform-runtime"]
          }, 
        }, 
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
			template: './public/index.html', 
    }),
  ],
  
};

