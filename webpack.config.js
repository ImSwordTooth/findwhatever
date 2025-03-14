var webpack = require('webpack'),
	path = require('path'),
	fileSystem = require('fs-extra'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	env = require('./utils/env'),
	CopyWebpackPlugin = require('copy-webpack-plugin'),
	TerserPlugin = require('terser-webpack-plugin');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');
var ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';

var alias = {};

// load the secrets
var secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js');

var fileExtensions = [
	'jpg',
	'jpeg',
	'png',
	'gif',
	'eot',
	'otf',
	'svg',
	'ttf',
	'woff',
	'woff2',
];

if (fileSystem.existsSync(secretsPath)) {
	alias['secrets'] = secretsPath;
}

const isDevelopment = process.env.NODE_ENV !== 'production';

var options = {
	mode: process.env.NODE_ENV || 'development',
	entry: {
		background: path.join(__dirname, 'src', 'pages', 'Background', 'index.js'),
		action: path.join(__dirname, 'src', 'pages', 'Background', 'action.js'),
		contentScript: path.join(__dirname, 'src', 'pages', 'Content', 'index.js'),
		options: path.join(__dirname, 'src', 'pages', 'Options', 'index.js')
	},
	chromeExtensionBoilerplate: {
		notHotReload: ['background', 'contentScript', 'action', 'options'],
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'build'),
		clean: true,
		publicPath: ASSET_PATH,
	},
	module: {
		rules: [
			{
				// look for .css or .scss files
				test: /\.(css|scss)$/,
				// in the `src` directory
				use: [
					{
						loader: 'css-loader',
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: 'css-loader',
					},
					{
						loader: 'less-loader',
						options: {
							lessOptions: {
								modifyVars: {
									'primary-color': '#12171a',
									'font-size-base': '12px',
									'border-radius-base': '6px',
								},
								javascriptEnabled: true
							}
						},
					},
				],
			},
			{
				test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
				type: 'asset/resource',
				exclude: /node_modules/,
				// loader: 'file-loader',
				// options: {
				//   name: '[name].[ext]',
				// },
			},
			{
				test: /\.svg$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'svg-sprite-loader',
						options: {
							symbolId: 'icon-[name]'
						}
					}
				]

				// options: {
				//   name: '[name].[ext]',
				// },
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(js|jsx)$/,
				use: [
					{
						loader: 'source-map-loader',
					},
					{
						loader: require.resolve('babel-loader'),
						options: {
							plugins: [
								isDevelopment && require.resolve('react-refresh/babel'),
							].filter(Boolean),
						},
					},
				],
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		alias: alias,
		extensions: fileExtensions
			.map((extension) => '.' + extension)
			.concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
	},
	plugins: [
		isDevelopment && new ReactRefreshWebpackPlugin(),
		new CleanWebpackPlugin({ verbose: false }),
		new webpack.ProgressPlugin(),
		// expose and write the allowed env vars on the compiled bundle
		new webpack.EnvironmentPlugin(['NODE_ENV']),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'src/manifest.json',
					to: path.join(__dirname, 'build'),
					force: true,
					transform: function (content, path) {
						// generates the manifest file using the package.json informations
						return Buffer.from(
							JSON.stringify({
								description: process.env.npm_package_description,
								version: process.env.npm_package_version,
								...JSON.parse(content.toString()),
							})
						);
					},
				},
			],
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'src/assets/img/popup.png',
					to: path.join(__dirname, 'build'),
					force: true,
				},
			],
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'pages', 'Options', 'index.html'),
			filename: 'options.html',
			chunks: ['options'],
			cache: false,
		}),
	].filter(Boolean),
	infrastructureLogging: {
		level: 'info',
	},
};

if (env.NODE_ENV === 'development') {
	options.devtool = 'cheap-module-source-map';
} else {
	options.optimization = {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: false,
			}),
		],
	};
}

module.exports = options;
