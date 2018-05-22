var webConfig = {
  entry: './src/device-ui-plugin-2.js',
  output: {
    filename: './build/device-ui-plugin-2.web.js',
    library: 'Device2UI',
    libraryTarget: 'var'
  },
  module:{
    loaders: [
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  },
  resolve: {
      alias: {
          "jquery": "jquery"
      }
  }
};

module.exports = webConfig;
