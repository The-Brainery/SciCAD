var config = {
  entry: './src/medella-bot.js',
  output: {
    filename: './build/medella-bot.web.js',
    library: 'MedellaBot',
    libraryTarget: 'var'
  },
  module:{
    loaders: [
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  }
};

module.exports = config;
