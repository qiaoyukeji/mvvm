/*
 * @Descripttion:
 * @version:
 * @Author: qiaoyurensheng@163.com
 * @Date: 2020-05-27 17:06:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-27 23:34:01
 */

import Dep from "./dep";

// 完成数据劫持
export default class Observer {
    constructor(data) {
        // console.log(data);
        // 数据转存
        this.data = data;
        // 遍历对象完成所有数据的劫持
        this.walk(this.data)

    }
    // 遍历对象
    walk(data) {
        if (!data || typeof data !== "object") {
            return
        }
        // 获取对象中的所有key值
        Object.keys(data).forEach(key => {
            // console.log(key);
            this.defineReactive(data, key, data[key])


        })
    }
    /**
     * @name: 动态设置响应式数据,设置set与get
     * @msg: 
     * @param: 数据，键，值
     * @return: 
     */
    defineReactive(data, key, value) {
        let dep = new Dep()
        Object.defineProperty(data, key, {
            // 可遍历的
            enumerable: true,
            // 不可再配置
            configurable: false,
            get: () => {
                // console.log("get");
                Dep.target && dep.addSub(Dep.target)

                return value
            },
            set: (newValue) => {
                console.log("set");
                value = newValue
                // todo 触发 view页面的变化
                dep.notify()
            }
        })
        this.walk(value)
    }
}