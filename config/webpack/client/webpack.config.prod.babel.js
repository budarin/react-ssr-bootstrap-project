import path from 'path';
import webpack from 'webpack';
import OptimizeJsPlugin from 'optimize-js-plugin';
import MinifyPlugin from 'babel-minify-webpack-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

import babelConfig from './babelLoaderConfig.js';

const config = {
    cache: false,
    target: 'web',
    profile: true,
    devtool: 'none',
    mode: 'production',
    entry: {
        client: ['./src/client/index.tsx'],
    },
    output: {
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: path.resolve('./dist'),
    },
    optimization: {
        occurrenceOrder: true,
        minimizer: [new MinifyPlugin(), new OptimizeJsPlugin({ sourceMap: false })],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                include: path.resolve('./src'),
                exclude: path.resolve('node_modules'),
                use: {
                    loader: 'babel-loader',
                    options: babelConfig,
                },
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                include: path.resolve('./src'),
                exclude: path.resolve('node_modules'),
                use: {
                    loader: 'image-size-loader',
                    options: {
                        digest: 'hex',
                        hash: 'sha512',
                        name: 'img/[name].[hash:8].[ext]',
                        context: path.resolve(__dirname, 'src'),
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader/useable',
                        options: {
                            hmr: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            modules: true,
                            localIdentName: '[hash:base64:8]',
                            // cssnano options
                            minimize: {
                                // safe: true,
                                zindex: false,
                                discardComments: { removeAll: true },
                            },
                        },
                    },
                    {
                        loader: 'postcss-loader',
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx', '.json'],
        modules: ['node_modules', path.resolve('./src')],
    },
    plugins: [
        new HardSourceWebpackPlugin({
            cacheDirectory: path.resolve('./node_modules/.cache/client/[confighash]'),
            recordsPath: path.resolve('./node_modules/.cache/client/[confighash]/records.json'),
            configHash: function(webpackConfig) {
                return require('node-object-hash')({ sort: false }).hash(webpackConfig);
            },
        }),
        new webpack.DefinePlugin({
            __DEV__: false,
            __PROD__: true,
            __BROWSER__: true,
            __SERVER__: false,
        }),
    ],
};

export default config;
