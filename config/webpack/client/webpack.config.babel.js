import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

// import CopyWebpackPlugin from 'copy-webpack-plugin';

import env from '../../../src/utils/getEnv';
import babelConfig from './babelLoaderConfig';

const { STATIC_HOST, STATIC_PORT, STATIC_URL } = env;

const config = {
    cache: true,
    target: 'web',
    profile: false,
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    entry: {
        client: ['./src/client/index.tsx'],
    },
    output: {
        filename: '[name].js',
        publicPath: STATIC_URL,
        chunkFilename: '[name].js',
        path: path.resolve('./dist'),
        hotUpdateChunkFilename: '[id].[hash].hot-update.js',
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
                        loader: '@budarin/ts-css-loader',
                        options: {
                            modules: true,
                            usable: true,
                            server: true,
                            camelCase: true,
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
        extensions: ['.ts', '.tsx', '.js', 'jsx', '.json'],
        modules: ['node_modules', 'src'],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.__DEV__': true,
            'process.env.__PROD__': false,
            'process.env.__BROWSER__': true,
            'process.env.__SERVER__': false,
        }),
        new webpack.WatchIgnorePlugin([/css\.d\.ts$/]), // due to slow building ignore changes
    ],
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    serve: {
        http2: true,
        port: STATIC_PORT,
        host: STATIC_HOST,
        https: {
            ca: fs.readFileSync('certs/cacert.crt'),
            key: fs.readFileSync('certs/server.key'),
            cert: fs.readFileSync('certs/server.crt'),
        },
        add: (app, middleware, options) => {
            // to have an ability to load resources from diff server origin
            app.use((ctx, next) => {
                ctx.set('Access-Control-Allow-Origin', '*');
                next();
            });

            middleware.webpack();
            middleware.content();
        },
    },
};

export default config;
