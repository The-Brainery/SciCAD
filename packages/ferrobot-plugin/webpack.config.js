var config = {
  entry: './src/ferrobot-ui-plugin.js',
  output: {
    filename: './build/ferrobot-ui-plugin.web.js',
    library: 'Ferrobot',
    libraryTarget: 'var'
  },
  module:{
    loaders: [
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  }
};

module.exports = config;
