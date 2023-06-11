module.exports = {
    // Other webpack configuration options...
  
    module: {
      rules: [
        // Other rules...
  
        // Rule for JavaScript files
        {
          test: /\.js$/,
          exclude: /node_modules\/(?!web3)/, // Exclude all node_modules except web3
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
  };
  