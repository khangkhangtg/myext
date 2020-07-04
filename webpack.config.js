const path = require('path');

module.exports = {
	// entry: ['./src/js/index.js', '@babel/polyfill'],
	entry: ['./src/main.js'],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/bundle.js'
	},
	devServer: {
		contentBase: './dist/'
	},
	plugins: [
		// "@babel/plugin-transform-runtime"
	]
}