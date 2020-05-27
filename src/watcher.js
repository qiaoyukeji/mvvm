/*
 * @Descripttion:订阅者
 * @version:
 * @Author: qiaoyurensheng@163.com
 * @Date: 2020-05-27 23:03:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-27 23:30:57
 */

import Dep from "./dep";

var $uid = 0;
export default class Watcher {
    constructor(exp, scope, cb) {
        this.exp = exp;
        this.scope = scope;
        this.cb = cb
        this.uid = $uid++
        this.update()

    }
    // 计算表达式
    get() {
        Dep.target = this;
        let newValue = Watcher.computeExpression(this.exp, this.scope)
        Dep.target = null
        return newValue
    }
    // 完成回调函数的调用
    update() {

        let newValue = this.get()
        // console.log(newValue);

        this.cb && this.cb(newValue)
    }
    // 定义一个静态的计算表达式函数
    static computeExpression(exp, scope) {
        // 创建函数
        // 把scope当做作用域
        // 函数内部使用with来指定作用域
        // 执行函数得到表达式的值
        let fn = new Function("scope", "with(scope){return " + exp + "}");
        return fn(scope)
    }
}