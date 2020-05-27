import Observer from "./observer";
import Compiler from "./compiler";

/*
 * @Descripttion:
 * @version:
 * @Author: qiaoyurensheng@163.com
 * @Date: 2020-05-27 15:01:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-28 00:09:21
 */
class Vue {
    constructor(options) {
        // console.log(options);
        // 获取元素DOM对象
        this.$el = document.querySelector(options.el);
        // console.log(this.$el);
        //转存数据
        this.$data = options.data || {};

        // 数据和函数的代理
        this._proxyData(this.$data)
        this._proxyMethods(options.methods)

        // 数据劫持
        new Observer(this.$data)

        // 模板编译
        new Compiler(this)

    }
    // 数据的代理 vm.$data.msg  =>   vm.msg
    _proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                set(newValue) {
                    data[key] = newValue
                },
                get() {
                    return data[key]
                }
            })
        })
    }

    // 函数代理
    _proxyMethods(methods) {
        if (methods && typeof methods === "object") {
            Object.keys(methods).forEach(key => {
                this[key] = methods[key]
            })
        }
    }
}
window.Vue = Vue;