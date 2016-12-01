/**
 * Created by kingsoft on 2016/11/30.
 */
var path = require("path");
var webpack = require('webpack');

module.exports = {
    entry: {
        index: ["./src/js/index/a.js", "./src/js/index/b.js"],
        //mobilecheck: "./src/js/mobilecheck.js"
    },
    output: {
        filename: "[name].min.js",
        path: path.join(__dirname, "./dist/js/index")
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.coffee'] // 配置简写，配置过后，书写该文件路径的时候可以省略文件后缀
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' }
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //     },
        //     output: {
        //         comments: false,
        //     }
        // }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
        //new webpack.optimize.CommonsChunkPlugin('common.js')
    ]
}

//提取公共部分
// var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
// module.exports = {
//     entry: {
//         p1: "./page1",
//         p2: "./page2",
//         p3: "./page3",
//         ap1: "./admin/page1",
//         ap2: "./admin/page2"
//     },
//     output: {
//         filename: "[name].js"
//     },
//     plugins: [
//         new CommonsChunkPlugin("admin-commons.js", ["ap1", "ap2"]),
//         new CommonsChunkPlugin("commons.js", ["p1", "p2", "admin-commons.js"])
//     ]
// };
