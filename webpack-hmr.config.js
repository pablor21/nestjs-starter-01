const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');
module.exports = function (options) {
    return {
        entry: ['webpack/hot/poll?100', options.entry],
        watch: true,
        target: 'node',
        externals: [
            nodeExternals({
                allowlist: ['webpack/hot/poll?100'],
            }),
        ],
        module: {
            rules: [
                {
                    test: /.tsx?|.js$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        mode: 'development',
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
                "@": path.resolve(__dirname, "src"),
                "@root": path.resolve(__dirname),
                "@modules": path.resolve(__dirname, "src", "modules"),
                "@lib": path.resolve(__dirname, "src", "lib"),
                "@config": path.resolve(__dirname, "config"),
                "@storage": path.resolve(__dirname, "storage"),
                "@public": path.resolve(__dirname, "public"),
                "@resources": path.resolve(__dirname, "resources"),
            }
        },

        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
            new StartServerPlugin({ name: options.output.filename }),
        ],
        output: {
            path: path.join(__dirname, 'dist'),
            filename: options.output.filename,
        },
    };

}