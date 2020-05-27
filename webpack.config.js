/*
 * @Descripttion:
 * @version:
 * @Author: qiaoyurensheng@163.com
 * @Date: 2020-05-27 14:54:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-27 14:56:42
 */
const path = require("path")

module.exports = {
    mode: "production",
    entry: path.resolve(__dirname, "./src/index.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "vue.js"
    }
}