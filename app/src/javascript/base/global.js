/*
 * ------------------------------------------
 * 浏览器兼容接口实现文件
 * @version  1.0
 * @author   weiwenqing(wqwei@corp.netease.com)
 * ------------------------------------------
 */
define(function() {
    if (!Date.now) {
        /**
         * 获取当前时间
         * @return {Number} 时间
         */
        Date.now = function() {
            return new Date().getTime();
        };
    }
    if (!String.prototype.trim) {
        /**
         * 去除首尾空格
         * @param {String} str 输入的字符串
         * @return {String} 去除首尾空格后的字符串
         */
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }
    if (!Array.prototype.indexOf) {
        /**
         * 获取指定对象在数组中的索引
         * @param {Object} obj 指定对象
         * @param {Number} opt_from 起始查找位置，默认为0
         * @return {Number} 索引值
         */
        Array.prototype.indexOf = function(obj, opt_from) {
            opt_from = parseInt(opt_from) || 0;
            for (var i = opt_from, length = this.length; i < length; i++) {
                if (this[i] === obj){
                    return i;
                }
            }
            return -1;
        };
    }
    if (!Array.isArray) {
        /**
         * 判断对象是否为数组
         * @param {Object} obj 对象
         * @return {Boolean} 是否为数组
         */
        Array.isArray = function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        };
    }
    if (!Array.prototype.forEach) {
        /**
         * 数据的每一项执行指定函数
         * @param  {Function} callback 指定函数
         * @param  {Object}   opt_this 上下文对象
         * @return {Void}
         */
        Array.prototype.forEach = function(callback, opt_this) {
            for (var i = 0, length = this.length; i < length; i++) {
                callback.call(opt_this, this[i], i, this);
            }
        };
    }

    if(!Array.prototype.revert){
        Array.prototype.revert = function() {
            var i=this.length,res =[];
            while(i--){
                res.push(this[i]);
            }
            return res;
        };
    }
});