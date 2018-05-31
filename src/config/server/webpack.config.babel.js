import path from 'path';
import webpack from 'webpack';
import babelConfig from './babelLoaderConfig.json';
import nodeExternals from 'webpack-node-externals';
// import CopyWebpackPlugin from 'copy-webpack-plugin';

import env from '../../utils/env';

const { STATIC_URL } = env;
const config = {
    mode: 'development',
    target: 'node',
    watch: true,
    cache: true,
    profile: false,
    devtool: 'cheap-module-eval-source-map',
    entry: ['webpack/hot/poll?1000', './src/server/index.js'],
    output: {
        path: path.resolve('./dist'),
        publicPath: '/',
        filename: 'server.js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: babelConfig,
                },
                exclude: path.resolve('node_modules'),
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
                        publicPath: STATIC_URL,
                        name: 'img/[name].[hash:7].[ext]',
                        context: path.resolve(__dirname, 'src'),
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'fake-style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            minimize: false,
                            importLoaders: 1,
                            localIdentName: '[name].[local]_[hash:7]',
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
        extensions: ['*', '.js', '.jsx'],
        modules: ['node_modules', path.resolve('./src')],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            __BROWSER__: false,
            __SERVER__: true,
            __DEV__: true,
            __PROD__: false,
        }),
    ],
    externals: [nodeExternals({ whitelist: ['webpack/hot/poll?1000'] })],
};

export default config;