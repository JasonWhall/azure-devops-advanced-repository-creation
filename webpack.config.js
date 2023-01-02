const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const srcDir = path.join(__dirname, "src");

const entries = fs.readdirSync(srcDir)
    .filter(dir => dir != 'Components' && fs.statSync(path.join(srcDir, dir)).isDirectory())
    .reduce((acc, dir) => ({ ...acc, [dir]: `${srcDir}/${dir}/${dir}`}), {})

console.log(entries)

module.exports = {
    entry: entries,
    output: {
        filename: "[name]/[name].js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.woff$/,
                type: 'asset/inline'
            },
            {
                test: /\.html$/,
                loader: "file-loader",
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.html' ],
        alias: {
            "azure-devops-extension-sdk": path.resolve("node_modules/azure-devops-extension-sdk")
        },
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "**/*.html", context: "src" }
            ]
        })
    ]
} 