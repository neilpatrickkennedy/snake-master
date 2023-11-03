const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    entry: {
        bundle: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name][contenthash].js',
        clean: true,
        assetModuleFilename: "[name][ext]"
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist"),
        },
        port: 4000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: () => [
                                    require('autoprefixer')
                                ]
                            }
                        }
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: /\.(?:jpg|jpeg|png|svg|webp|gif|ico)$/i,
                type: "asset/resource"
            },
            {
                test: /\.(?:ogg|wav|mp3)$/i,
                type: "asset/resource"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Snake-Master 2000",
            filename: "index.html",
            template: path.resolve(__dirname, "src/index.html")
        }),
        // new HtmlWebpackPlugin({
        //     favicon: path.resolve(__dirname, "src/assets/images/favicon.ico")
        // }),
        new BundleAnalyzerPlugin({analyzerPort: 8282, openAnalyzer: false}),
        new FaviconsWebpackPlugin({
            logo: path.resolve(__dirname, "src/assets/images/favicon.png")
        })
    ]
};