const rspack = require('@rspack/core');
const path = require('path');
const fileSystem = require('fs-extra');
const env = require('./utils/env');

const ASSET_PATH = process.env.ASSET_PATH || '/';
const isDevelopment = process.env.NODE_ENV !== 'production';

const fileExtensions = [
	'jpg',
	'jpeg',
	'png',
	'gif',
	'eot',
	'otf',
	'ttf',
	'woff',
	'woff2',
];

const alias = {
	'react': 'preact/compat',
	'react-dom/test-utils': 'preact/test-utils',
	'react-dom': 'preact/compat',
	'react/jsx-runtime': 'preact/jsx-runtime',
};

const secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js');
if (fileSystem.existsSync(secretsPath)) {
	alias['secrets'] = secretsPath;
}

const config = {
	mode: process.env.NODE_ENV || 'development',
	target: ['web', 'es2022'],
	entry: {
		background: path.join(__dirname, 'src', 'pages', 'Background', 'index.js'),
		action: path.join(__dirname, 'src', 'pages', 'Background', 'action.js'),
		contentScript: path.join(__dirname, 'src', 'pages', 'Content', 'index.js'),
		options: path.join(__dirname, 'src', 'pages', 'Options', 'index.js'),
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'build'),
		clean: true,
		publicPath: ASSET_PATH,
	},
	experiments: {
		// 关闭 Rspack 默认 CSS 处理，确保 css-loader 的 [[id, cssText]] 格式不变（兼容 ShadowRoot 内联注入）
		css: false,
	},
	module: {
		rules: [
			{
				test: /\.(css|scss)$/,
				use: [
					{
						loader: 'css-loader',
					},
					{
						loader: 'postcss-loader',
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
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				use: ['@svgr/webpack'],
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
								javascriptEnabled: true,
							},
						},
					},
				],
			},
			{
				test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
				type: 'asset/resource',
				exclude: /node_modules/,
			},
			{
				test: /\.html$/,
				use: ['html-loader'],
				exclude: /node_modules/,
			},
			{
				test: /\.(js|jsx|ts|tsx)$/,
				exclude: /node_modules/,
				loader: 'builtin:swc-loader',
				options: {
					jsc: {
						target: 'es2022',
						parser: {
							syntax: 'ecmascript',
							jsx: true,
						},
						transform: {
							react: {
								runtime: 'automatic',
								importSource: 'preact',
								throwIfNamespace: false,
								development: isDevelopment,
								useBuiltins: false,
							},
						},
					},
				},
			},
		],
	},
	resolve: {
		alias: alias,
		extensions: fileExtensions
			.map((extension) => '.' + extension)
			.concat(['.js', '.jsx', '.ts', '.tsx', '.css', '.svg']),
	},
	plugins: [
		new rspack.EnvironmentPlugin(['NODE_ENV']),
		new rspack.CopyRspackPlugin({
			patterns: [
				{
					from: process.env.npm_lifecycle_event?.includes(':ff')
						? 'src/manifest_firefox.json'
						: 'src/manifest.json',
					to: path.join(__dirname, 'build/manifest.json'),
					force: true,
					transform: function (content) {
						return Buffer.from(
							JSON.stringify({
								description: process.env.npm_package_description,
								version: process.env.npm_package_version,
								...JSON.parse(content.toString()),
							})
						);
					},
				},
				{
					from: 'src/assets/img/popup.png',
					to: path.join(__dirname, 'build/popup.png'),
					force: true,
				},
			],
		}),
		new rspack.HtmlRspackPlugin({
			template: path.join(__dirname, 'src', 'pages', 'Options', 'index.html'),
			filename: 'options.html',
			chunks: ['options'],
		}),
	],
	devtool: isDevelopment ? 'cheap-module-source-map' : false,
	optimization: {
		minimize: !isDevelopment,
	},
};

module.exports = config;
