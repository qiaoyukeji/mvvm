/*
 * @Descripttion:
 * @version:
 * @Author: qiaoyurensheng@163.com
 * @Date: 2020-05-27 23:24:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-27 23:28:05
 */
export default class Dep {
    constructor() {
        // 存放所有的watcher
        this.subs = {}
    }
    addSub(target) {
        this.subs[target.uid] = target
    }
    // 通知
    notify() {
        for (let uid in this.subs) {
            this.subs[uid].update();
        }
    }
}