/*
 * @Descripttion:模板编译
 * @version:
 * @Author: qiaoyurensheng@163.com
 * @Date: 2020-05-27 17:07:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-28 00:09:46
 */

import Watcher from "./watcher";

// 完成模板编译
export default class Compiler {
    // 接收 this
    constructor(context) {
        // console.log(context);
        this.$el = context.$el;
        this.context = context;
        if (this.$el) {
            // 把原始的dom转换为文档片段
            this.$fragment = this.nodeToFragment(this.$el)
            console.log(this.$fragment);

            // 编译模板
            this.compiler(this.$fragment)

            // 把文档片段添加到页面中
            this.$el.appendChild(this.$fragment)
        }
    }
    // 节点转换为文档片段
    nodeToFragment(node) {
        // console.log("12", node);
        let fragment = document.createDocumentFragment();
        // 节点的子节点数组
        // console.log(node.childNodes);
        if (node.childNodes && node.childNodes.length) {
            node.childNodes.forEach(child => {
                // console.log(child);
                // 判断是不是需要添加的节点
                // 如果是注释节点，或者无用的换行，不添加到文档片段
                if (!this.ignore(child)) {
                    // console.log(child);
                    fragment.appendChild(child)
                }
            })
        }
        return fragment;


    }
    // 忽略无用节点
    ignore(node) {
        var reg = /^[\t\n\r]+/;
        return (node.nodeType === 8 || (node.nodeType === 3 && reg.test(node.textContent)))
    }
    // 模板编译
    compiler(node) {
        if (node.childNodes && node.childNodes.length) {
            node.childNodes.forEach(child => {
                // console.log(child);
                if (child.nodeType === 1) {
                    // 当nodeType =1 时，是元素节点
                    this.compilerElementNode(child)
                } else if (child.nodeType === 3) {
                    // 当nodeType =3 时，是文本节点
                    this.compilerTextNode(child)
                }

            })
        }
    }
    // 编译元素节点
    compilerElementNode(node) {
        let that = this
        // 获取所有元素的属性
        let attrs = [...node.attributes]
        // console.log(attrs);
        attrs.forEach(attr => {
            // console.log(attr);
            let { name: attrName, value: attrValue } = attr
            if (attrName.indexOf("v-") === 0) {
                let dirName = attrName.slice(2)

                switch (dirName) {
                    case "text":
                        // console.log("text1");
                        new Watcher(attrValue, this.context, (newValue) => {
                            node.textContent = newValue
                        })
                        break;
                    case "model":
                        // 值变则input框内变
                        new Watcher(attrValue, this.context, (newValue) => {
                            node.value = newValue
                        })
                        // input框内变则值变
                        node.addEventListener("input", e => {
                            that.context[attrValue] = e.target.value
                        })
                        break;
                }
            }
            // 判断是否是以@开头的事件
            if (attrName.indexOf("@") === 0) {
                this.compilerMethods(this.context, node, attrName, attrValue);
            }

        })


        this.compiler(node);
    }
    // 编译事件函数
    compilerMethods(scope, node, attrName, attrValue) {
        // 获取类型
        let type = attrName.slice(1);
        // 获取函数体
        let fn = scope[attrValue];
        node.addEventListener(type, fn.bind(scope))
    }
    // 编译文本节点
    compilerTextNode(node) {
        // console.log(node);
        let text = node.textContent.trim();
        // console.log(text);
        if (text) {
            // 把text 字符串转化为表达式
            let exp = this.parseTextExp(text)
            console.log(exp);

            // 添加订阅者，计算表达式的值
            // 当表达式依赖的数据发生变化时，1.重新计算表达式值，2.node.textContent 赋值最新，即可完成 Model -> View 的响应
            // 传入表达式,作用域和回调函数

            new Watcher(exp, this.context, (newValue) => {
                node.textContent = newValue;
            })
        }

    }

    // 文本字符串转化为表达式
    // 1{{msg+"2"}}3
    // "1"+"msg"+"2"+"3"
    parseTextExp(text) {
        // 匹配插值表达式的正则
        let regText = /\{\{(.+?)\}\}/g;
        // 分割插值表达式
        let pices = text.split(regText)
        // console.log(pices);
        // 匹配插值表达式
        let matches = text.match(regText)
        // console.log(matches);
        // 表达式数组
        let tokens = [];
        pices.forEach(item => {
            if (matches && matches.indexOf("{{" + item + "}}") > -1) {
                tokens.push("(" + item + ")")
            } else {
                tokens.push("`" + item + "`")
            }
        })
        return tokens.join("+");

    }

}