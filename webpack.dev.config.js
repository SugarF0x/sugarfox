const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        ignored: [/node_modules/,/db/]
    },
    entry: {
        main: ["@babel/polyfill", "whatwg-fetch", "./src/public/index.js"]
    },
    output: {
        path: path.join(__dirname, 'dist/public/'),
        publicPath: "",
        filename: "js/[name].bundle.js"
    },
    target: "web",
    module: {
        rules: [
            {
                // js - компиляция es6+ в es5
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|txt)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'fonts'
                }
            },
            {
                test: /\.webp$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'img'
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.css/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/public/index.html",
            filename: "index.html",
            excludeChunks: ['server']
        }),
        new CopyPlugin([
            {
                from: 'src/public/img',
                to: 'img/[path][name].[ext]',
                toType: 'template'
            },
            {
                from: 'src/public/archive',
                to: 'archive'
            }
        ]),
        new VueLoaderPlugin()
    ]
};