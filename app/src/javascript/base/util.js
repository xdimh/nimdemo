/*
 * ------------------------------------------
 * 通用接口实现文件
 * @version  1.0
 * @author   weiwenqing(wqwei@corp.netease.com)
 * ------------------------------------------
 */

define([
    '{lib}base/global.js',
    'ui/base',
    '{lib}base/klass.js',
    '{lib}util/dispatcher/module.js',
    '{lib}util/template/tpl.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}base/util.js',
    '{lib}util/cache/cookie.js',
    '{lib}util/ajax/rest.js',
    '{lib}util/ajax/xdr.js',
    '{lib}util/chain/chainable.js',
    '{pro}base/global.js',
    '{pro}base/const.js',
    '{pro}base/regular.js'
    ],
    function(NEJ,ui,k,md,tpl,e,v,u,jc,j,jr,$,g,dc,p,o) {
    // variable declaration
    var using = NEJ.P;
    var du = using('dd.util');
    var typeMap, msgNode, timer, timer2;

    var passFn = function() {
        return true;
    };

    /**
     * 获取祖先中第一个符合条件的节点
     * @param  {Node} node      起始节点
     * @param  {Function} condition 条件函数
     * @param  {Node} opt_root  根节点
     * @return {[type]}           [description]
     */
    du.findAncestor = function(node, condition, opt_root) {
        while (node && node !== opt_root) {
            if (u._$isFunction(condition) && condition(node)) {
                return node;
            }
            node = node.parentNode;
        }
    };
    /**
     * 名称转化为类名
     * @param  {String} name 名称
     * @return {String}      类名
     */
    du.nameToClass = function(name) {
        return 'j-' + name;
    };
    /**
     * 类名转化为名称
     * @param  {String} clazz 类名
     * @return {String}       名称
     */
    du.classToName = function(clazz) {
        return clazz.substr && clazz.substr(2);
    };
    $._$implement({
        _$toggleClass: function(className) {
            if (this._$hasClassName(className)) {
                this._$delClassName(className);
            } else {
                this._$addClassName(className);
            }
            return this;
        },
        _$find: function(sl) {
            return this._$children(sl, true);
        }
    });
    /**
     * 类似e._$get, 不过是传入选择器
     * @param {Node|String} 选择器或者节点
     * @param {Node|Null} 可以传入Context 限制查找范围
     * @return {Node}
     */
    du.$ = function(sl, context) {
        var container = document.createElement('div');
        if (typeof sl === 'string' && sl.trim().indexOf("<") === 0) {
            container.innerHTML = sl;
            var res = $(container.childNodes);
            return res;
        }
        return $(sl, context);
    };
    /**
     * 获取节点的第一个父元素满足selector
     * @param node {Node} 字节点
     * @param {Function|String|Null} 如果不传入则获得第一个父节点,可以传入选择器进行过滤
     */
    du.getParent = function(node, selector) {
        var test, parent;
        if (!selector) {
            test = passFn;
        }
        else {
            test = typeof selector === 'function' ? selector : function(node) {
                return nes.matches(node, selector);
            };
        }
        if (!node) {
            return;
        }
        parent = node.parentNode;
        while (parent) {
            if (test(parent)) {
                return parent;
            }
            else {
                parent = parent.parentNode;
            }
        }
    };

    /**
     * 获取指定名称的第一个节点
     * 页面结构举例
     * [code type="html"]
     *   <div class='j-title'></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var node = du.get('title', context);
     * [/code]
     * @param  {String} name 名称
     * @param  {Node} context 上下文节点
     * @return {Node}      节点
     */
    du.get = function(name, opt_context) {
        var nodes = e._$getByClassName(opt_context, this.nameToClass(name));
        return nodes && nodes[0];
    };
    /**
     * 获取指定名称的所有节点
     * @param  {String} name 名称
     * @param  {Node}   opt_context 上下文节点
     * @return {Node}      节点
     *
     */
    du.getAll = function(name, opt_context) {
        return e._$getByClassName(opt_context, this.nameToClass(name));
    };
    /**
     * 显示信息
     *  @param  {Object} options 配置参数
     * @config  {String} message 信息
     * @config  {String} type    信息类型('error','success','hint'),默认为'hint'
     * @config  {Boolean} autoDisappear    是否自动消息，默认为true
     * @return {Void}
     */

    du.showMessage = function(options) {
        options = options || o;
        var message = options.message;
        var content = du.get('content', msgNode);
        var closer = options.closer;
        var type = options.type || 'hint';
        var delay = options.delay;
        var autoDisappear = options.autoDisappear;
        if (!msgNode) {
            msgNode = document.createElement('div');
            msgNode.innerHTML = '<p class="j-content"></p>';
            document.body.appendChild(msgNode);
            msgNode.className = 'u-msg1 u-msg1-' + type;
        }
        window.clearTimeout(timer);
        window.clearTimeout(timer2);
        content = du.get('content', msgNode);
        content.innerHTML = message || '';
        if (closer && !autoDisappear) {
            content.innerHTML += '<a href="javascript:void(0);" class="closer j-closer" title="我知道了">×</a>';
            v._$addEvent(du.get('closer', msgNode), 'click', function() {
                e._$delClassName(msgNode, 'u-msg1-show');
                closer();
            });
        }
        msgNode.className = 'u-msg1 u-msg1-' + type;
        if (options.klass) {
            msgNode.className += ' ' + options.klass;
        }
        timer2 = window.setTimeout(function() {
            e._$addClassName(msgNode, 'u-msg1-show');
        }, 0);
        autoDisappear = autoDisappear === undefined ? true : autoDisappear;
        if (autoDisappear) {
            timer = window.setTimeout(function() {
                e._$delClassName(msgNode, 'u-msg1-show');
            }, delay || 2500);
        }
    };
    /**
     * 隐藏信息
     * @return {Void}
     */
    du.hideMessage = function() {
        if (msgNode) {
            e._$delClassName(msgNode, 'u-msg1-show');
        }
    };
    /**
     * 显示成功信息
     * @param  {Object|String} options 配置参数|消息内容
     * @config  {String} message 信息
     * @config  {Boolean} autoDisappear    是否自动消息，默认为true
     * @return {Void}
     */
    du.showSuccess = function(options) {
        if (u._$isString(options)) {
            options = {
                message: options
            };
        }
        options = options || {};
        options.type = 'success';
        return du.showMessage(options);
    };
    /**
     * 显示提示信息
     * @param  {Object} options 配置参数
     * @config  {String} message 信息
     * @config  {Boolean} autoDisappear    是否自动消息，默认为true
     * @return {Void}
     */
    du.showHint = function(options) {
        if (u._$isString(options)) {
            options = {
                message: options
            };
        }
        options = options || {};
        options.type = 'hint';
        return du.showMessage(options);
    };
    /**
     * 显示错误信息
     * @param  {Object} options 配置参数
     * @config  {String} message 信息
     * @config  {Boolean} autoDisappear    是否自动消息，默认为true
     * @return {Void}
     */
    du.showError = function(options) {
        if (u._$isString(options)) {
            options = {
                message: options
            };
        }
        options = options || {};
        options.type = 'error';
        // QA反馈页面切换的时候会因为AJAX被中断而导致错误提示，这里将错误提示延迟.
        if(/(网络异常，请检查后再试)|(服务器返回异常状态)/.test(options.message)) {
            setTimeout(function(){
                du.showMessage(options);
            },1000);
        }
        else{
            return du.showMessage(options);
        }
    };
    /**
     * cookie控制显示隐藏：节点需默认隐藏，没有cookie时显示，存在cookie则隐藏
     */
    du.toggleByCookie = function(options) {
        var node = options.node;
        var cookie = options.cookie;
        var closer = options.closer;
        if (!(node && u._$isObject(cookie) && cookie.name)) {
            return;
        }
        if (u._$isString(node)) {
            node = e._$get(node);
        }
        if (node && !jc._$cookie(cookie.name)) {
            node.style.display = '';
            if (closer) {
                v._$addEvent(closer, 'click', function() {
                    node.style.display = 'none';
                    jc._$cookie(cookie.name, {
                        value: cookie.value || 1,
                        expires: cookie.expires || 7
                    });
                }._$bind(this));
            }
        }
    };
    /**
     * 格式化文件大小
     * @param  {Number|String}  size 文件大小
     * @return {String}         格式化后的字符串
     */
    du.format = function(size) {
        var units = ['B', 'K', 'M', 'G', 'T'];
        size = parseInt(size, 10);
        if (u._$isNumber(size) && size >= 0) {
            var i = 0;
            var unit = units[i];
            while(unit = units[i]) {
                if (size < 1024) {
                    break;
                }
                size = size / 1024;
                i++;
            }
            return Math.round(size * 100) / 100 + units[i];
        }
    };
    /**
     * clone一个对象
     * @param  {Object} obj 要clone的对象
     * @return {Object}     clone出来的对象
     */
    du.clone = function(obj) {
        if (obj === undefined) {
            return undefined;
        }
        return JSON.parse(JSON.stringify(obj));
    };
    /**
     * 去所有空格
     * @param {String} str 输入的字符串
     * @return {String} 去除所有空格后的字符串
     */
    du.trimAll = function(str) {
        return str.replace(/\s+/g, "");
    };
    /**
     * 合并连续空格
     * @param {String} str 输入的字符串
     * @return {String} 合并连续空格后的字符串
     */
    du.mergeSpace = function(str) {
        return str.replace(/\s+/g, " ");
    };
    /**
     * 列表模块中显示加载中状态
     * @param  {Object} 事件信息
     * @return {Void}
     */
    du.showListLoading = function(event) {
        event.value = '<div class="u-load">数据加载中<span class="loadicon"></span></div>';
    };
    /**
     * 列表模块中显示提示信息
     * @param  {Object} 事件信息
     * @return {Void}
     */
    du.showListMessage = function(msg, event) {
        event.value = '<div class="u-msg2">' + msg + '</div>';
    };
    /**
     * 列表模块中显示错误信息
     * @param  {Object} 事件信息
     * @return {Void}
     */
    du.showListError = function(event) {
        switch (event.action) {
            case 'add':
                du.showError('新建失败，请稍后再试！');
                break;
            case 'update':
                du.showError('修改失败，请稍后再试！');
                break;
            case 'delete':
                du.showError('删除失败，请稍后再试！');
                break;
            default:
                du.showError('操作失败，请稍后再试！');
        }
    };
    /**
     * 根据素材类型id获取类型数据
     * @param  {Number} id 类型id
     * @return {Object}    类型
     */
    du.getType = function(id) {
        if (!typeMap) {
            typeMap = {};
            var types = dc.TYPES;
            var i = 0;
            var type = types[i];
            while(type = types[i]){
                typeMap[type.id] = type;
                i++;
            }
        }
        return typeMap[id];
    };
    /**
     * 判断一个字符串是不是一个合法的date字符串，如:2012-9-12, 2013/09/14
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    du.isDate = function(str) {
        if (!str) {
            return;
        }
        var arr = str.match(/(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})/);
        if (!arr) {
            return false;
        }
        var reg = /^0*/;
        var yearNum = parseInt(arr[1].replace(reg, ''), 10);
        var monthNum = parseInt(arr[3].replace(reg, ''), 10) - 1;
        var dateNum = parseInt(arr[4].replace(reg, ''), 10);
        var date = new Date(yearNum, monthNum, dateNum);
        return date.getFullYear() === yearNum && date.getMonth() === monthNum && date.getDate() === dateNum;
    };
    /**
     * 文件上传控件通用消息处理函数
     * @param  {Object} event 事件对象
     * @param  {Object} param 文件上传控件的输入参数
     * @return {Void}
     */
    du.onUploaderMessage = (function() {
        var status = '';
        return function(event, param) {
            var types = ['', '图片', '音频', '视频'];
            var type = types[param.type] || '文档';
            switch (event.type) {
                case 'validated':
                    switch (event.data.code) {
                        case 0:
                            du.showError('请选择要上传的文件');
                            break;
                        case 1:
                            du.showError(type + '格式必须为：' + param.extension);
                            break;
                        case 2:
                            du.showError(type + '大小不能超过' + param.size);
                            break;
                        case 3:
                            du.showError(type + '尺寸不能超过' + param.dimension);
                            break;
                        case 4:
                            du.showError(type + '原图不能超过' + (param.maxSize || '10M') + '.或压缩后超过' + param.size);
                            break;
                        default:
                            break;
                    }
                    break;
                case 'beforeupload':
                    if (navigator.onLine !== undefined && !navigator.onLine) {
                        du.showError('网络异常，请稍后再试');
                        event.stop = true;
                    }
                    break;
                case 'uploading':
                    du.handleTabItemsClick(false);
                    du.showHint({
                        message: '上传中...',
                        autoDisappear: false
                    });
                    break;
                case 'uploaded':
                    du.handleTabItemsClick(true);
                    if (event.data.code === 400) {
                        du.showError('上传失败:' + (event.data.result || type));
                    }
                    break;
                case 'offline':
                    du.handleTabItemsClick(true);
                    if (status === 'uploading') {
                        du.showError('网络异常，请稍后再试');
                    }
                    break;
                default:
                    break;
            }
            status = event.type === 'offline' ? '' : event.type;
        };
    })();
    /**
     * 去除字符串中html标签
     * @param  {String} str 字符串
     * @return {String}     处理后的字符串
     */
    du.removeTag = function(str) {
        var node = document.createElement('div');
        node.innerHTML = str || '';
        return node.innerText;
    };
    /**
     * 字符串转表情
     * @param  {String} str 字符串
     * @param  {Boolean} 是否使用hidpi版本
     * @return {String}     处理后的字符串
     */
    du.toEmot = function(str, hdpi) {
        if (!str) {
            return;
        }
        str = u._$escape(str);
        u._$forEach(dc.EMOTS_SORT, function(item) {
            str = str.replace(new RegExp("\\/"+item.title, "g") , '<img title="' + item.title + '"class="u-emot" src="' + (!hdpi ? item.url : item.url.replace('.png', '@2x.png')) + '">');
        });
        return str;
    };

    du.handleTabItemsClick = function(isFinished) {
        var parent = e._$get('module-box');
        var items = du.getAll('item', parent);
        var callback = function(event) {
            if (!window.confirm('正在上传，确定要离开此页？')) {
                var ev = event || window.event;
                ev.preventDefault();
            }
        };
        if (isFinished) {
            u._$forEach(items, function(item, index, that) {
                v._$clearEvent(item, 'click');
            });
        } else {
            u._$forEach(items, function(item, index, that) {
                v._$addEvent(item, 'click', callback);
            });
        }
    };
    /**
     * parse url
     * @param  {String} str 字符串字符串
     * @return {Object}     url对象
     */
    du.parseURL = function(str) {
        if (!du.validator.url(str)) {
            return;
        }
        var a = document.createElement('a');
        a.href = str;
        return {
            protocol: a.protocol,
            hostname: a.hostname,
            port: a.port,
            search: a.search,
            hash: a.hash
        };
    };
    /**
     * 预处理url
     * @param  {String} str url字符串
     * @return {String}     处理后的url字符串
     */
    du.proprocessURL = function(str) {
        if (!str || !str.indexOf) {
            return;
        }
        if (!/^https?:\/\//.test(str)) {
            str = 'http://' + str;
        }
        return str;
    };
    // 通用验证对象
    du.validator = {
        /**
         * 字符串是否是合法url
         * @param  {String} str 待检测字符串
         * @return {Boolean}    是否合法
         */
        url: function(str) {
            if (!str) {
                return;
            }
            //中文url的可能性
            return /^(https?:\/\/([-\w]+\.)+[-\w]+(?:\:\d+)?(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)$/i.test(str);
        },
        /**
         * 字符串是否是合法的易信url
         * @param  {String} str 待检测字符串
         * @return {Boolean}    是否合法
         */
        yixinUrl: function(str) {
            if (!str) {
                return;
            }
            return /^yixin:\/\//i.test(str);
        },
        /**
         * 字符串是否是合法email
         * @param  {String} str 待检测字符串
         * @return {Boolean}    是否合法
         */
        email: function(str) {
            if (!str) {
                return;
            }
            return /^\w[\w\.-]*[a-zA-Z0-9]?@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/.test(str);
        },
        smsCode : function(str) {
            if(!str) {
                return false;
            }
            return true;
        },
        /**
         * 字符串是否是合法的手机号
         * @param  {String} str 待检测字符串
         * @return {Boolean}    是否合法
         */
        mobile: function(str) {
            str = str.trim();
            if (!str) {
                return;
            }
            var _url = '/verify/verifyPhoneNum',
                _flag = !1;
            jr._$request(_url, {
                method: 'POST',
                timeout: 1000,
                query: {
                    'phoneNum': str
                },
                sync: true,
                onload: function(cb) {
                    cb = JSON.parse(cb);
                    _flag = (cb && cb.result === 200) ? !0 : !1;
                },
                onerror: function() {
                    _flag = !1;
                }
            });
            return _flag;
        },
        /**
         * 字符串是否是合法的固定电话号
         * @param  {String} str 待检测字符串
         * @return {Boolean}    是否合法
         */
        phone: function(str) {
            if (!str) {
                return;
            }
            return /^0\d{2,3}\-\d{7,8}$/.test(str);
        },
        id: function(str) {
            /**
             * 字符串是否是合法的身份证号
             * @param  {String} str 待检测字符串
             * @return {Boolean}    是否合法
             */
            var isIdCard = function(e) {
                var o = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1],
                    u = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
                function n(e) {
                    var t = 0;
                    if(e[17].toLowerCase() === "x") {
                        e[17] = 10;
                    }
                    for (var n = 0; n < 17; n++){
                        t += o[n] * e[n];
                    }
                    var valCodePosition = t % 11;
                    return (""+e[17] === ""+u[valCodePosition]) ? !0 : !1;
                }

                function r(e) {
                    var t = e.substring(6, 10),
                        n = e.substring(10, 12),
                        r = e.substring(12, 14),
                        i = new Date(t, parseFloat(n) - 1, parseFloat(r));
                    return i.getFullYear() !== parseFloat(t) || i.getMonth() !== parseFloat(n) - 1 || i.getDate() !== parseFloat(r) ? !1 : !0;
                }

                function i(e) {
                    var t = e.substring(6, 8),
                        n = e.substring(8, 10),
                        r = e.substring(10, 12),
                        i = new Date(t, parseFloat(n) - 1, parseFloat(r));
                    return i.getYear() !== parseFloat(t) || i.getMonth() !== parseFloat(n) - 1 || i.getDate() !== parseFloat(r) ? !1 : !0;
                }

                function s(e) {
                    e = e.replace(/ /g, "").trim();
                    if (e.length === 15) {
                        return !1;
                    }
                    if (e.length === 18) {
                        var i = e.split("");
                        return r(e) && n(i) ? !0 : !1;
                    }
                    return !1;
                }
                return s(e);
            };
            /**
             * 身份证括号检查
             * @param  {[type]} e [description]
             * @return {[type]}   [description]
             */
            var check = function(e) {
                if (/\(/.test(e) && !/\)/.test(e)) {
                    return !1;
                }
                if (/\)/.test(e) && !/\(/.test(e) ) {
                    return !1;
                }
                return !0;
            };
            /**
             * 澳门身份证
             * @param  {[type]}  e [description]
             * @return {Boolean}   [description]
             */
            var isMIdCard = function(e) {
                if (!check(e)){
                    return !1;
                }
                e = e.replace('(', '').replace(')', '');
                if (!/^\d{1}\d{6}\d{1}$/.test(e)){
                    return !1;
                }
            };
            /**
             * 香港身份证
             * @param  {[type]}  e [description]
             * @return {Boolean}   [description]
             */
            var isHIdCard = function(e) {
                if (!check(e)){
                    return !1;
                }
                e = e.replace('(', '').replace(')', '');
                if (!/^[ACRUZXWOBN]\d{7}$/.test(e)){
                    return !1;
                }
                var m = {
                    "A": 1,
                    "B": 2,
                    "C": 3,
                    "D": 4,
                    "E": 5,
                    "F": 6,
                    "G": 7,
                    "H": 8,
                    "I": 9,
                    "J": 10,
                    "K": 11,
                    "L": 12,
                    "M": 13,
                    "N": 14,
                    "O": 15,
                    "P": 16,
                    "Q": 17,
                    "R": 18,
                    "S": 19,
                    "T": 20,
                    "U": 21,
                    "V": 22,
                    "W": 23,
                    "X": 24,
                    "Y": 25,
                    "Z": 26
                };
                var o = [8, 7, 6, 5, 4, 3, 2],
                    key = e.slice(0, 1),
                    count = 0;
                var area = m[key],
                    arr = e.slice(1, 7).split("");
                arr.unshift(area);
                for (var i = 0; i < o.length; i++) {
                    count += o[i] * arr[i];
                }
                var y = count % 11;
                return (y === 0 || (11 - y) === parseInt(e.slice(-1)) );
            };
            /**
             * 台湾身份证
             * @param  {[type]}  e [description]
             * @return {Boolean}   [description]
             */
            var isTIdCard = function(e) {
                if (!check(e)){
                    return !1;
                }
                e = e.replace('(', '').replace(')', '');
                if (!/^[A-Z][1|2]\d{8}$/.test(e)){
                    return !1;
                }
                var m = {
                    "A": 10,
                    "B": 11,
                    "C": 12,
                    "D": 13,
                    "E": 14,
                    "F": 15,
                    "G": 16,
                    "H": 17,
                    "I": 34,
                    "J": 18,
                    "K": 19,
                    "L": 20,
                    "M": 21,
                    "N": 22,
                    "O": 35,
                    "P": 23,
                    "Q": 24,
                    "R": 25,
                    "S": 26,
                    "T": 27,
                    "U": 28,
                    "V": 29,
                    "W": 32,
                    "X": 30,
                    "Y": 31,
                    "Z": 33
                };
                var o = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1];
                var area = m[e.slice(0, 1)],
                    num = area + e.slice(1, 9);
                var arr = num.split(""),
                    count = 0;
                for (var i = 0; i < o.length; i++) {
                    count += o[i] * arr[i];
                }
                var y = count % 10;
                return (y === 0 || (10 - y) === parseInt(e.slice(-1)));
            };
            if (!str){
                return;
            }
            str = str.toUpperCase();
            return isIdCard(str) || isHIdCard(str) || isTIdCard(str) || isMIdCard(str);
        },
        /**
         * 字符串是否是合法的密码(数字/字母/英文符号，最少6位)
         * @param  {String} str 待检测字符串
         * @return {Boolean}    是否合法
         */
        password: function(str) {
            if (!str){
                return;
            }
            return /^[-~`!@#$%^&*()_+=|{}\[\]:;"'<,>.?\/\d\w]{6,18}$/.test(str);
        },
        /**
         * 字符串是否是合法的密码(必须包含数字和字母，不能纯数字纯英文，8-20位,用户易信支付登陆)
         * @param  {String} str 待检测字符串
         * @return {Boolean}    是否合法
         */
        password2: function(str) {
            if (!str){
                return;
            }
            return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(str);
        },
        /**
         * 字符串是否是合法的密码(数字/字母/英文符号，最少6位,最多12位)
         * @param  {String} str 待检测字符串
         * @return {Boolean}    是否合法
         */
        password3: function(str) {
            if (!str){
                return;
            }
            return /^[-~`!@#$%^&*()_ +=|{}\[\]:;"'<,>.?\/\d\w]{6,12}$/.test(str);
        },
        /**
         * 邮政编码验证
         * @param {String} str 待检测字符串
         * @returns {Boolean}    是否合法
         */
        postcode : function(str) {
            if(!str){
                return;
            }
            return /^[1-9][0-9]{5}$/.test(str);
        },
        /**
         * 检测备付金合法性
         * @param {String} str 待检测字符串
         * @returns {Boolean}    是否合法
         */
        refound : function(str) {
            if(!str){
                return;
            }
            return /^(?:1(?!000$)|[2-9])\d{3,}$/.test(str);
        }
    };
    /**
     * uri转object
     * @param {String}
     * @return {Object}
     */
    du.uriToObject = function(uri) {
        uri = uri.split('/');
        return {
            "bucket": uri[uri.length - 2],
            "object": uri[uri.length - 1]
        };
    };

    /**
     * 将nos返回的urihttp
     * @param  {[type]} uri [description]
     * @return {[type]}     [description]
     */
    du.transUri = function(uri, http) {
        return uri && uri.replace(/http:\/\/nos(-yx)?\.netease\.com/, http ? 'http://nos.163.com' : 'https://nos.163.com');
    };
    /**
     * 将long型的时间转换成yyyy-MM-dd字符串型, 或可以传入format
     * @param  {Number} time 时间
     * @return {String}      时间字符串
     */
    du.transTime = function(time, format) {
        return time && u._$format(time, format || 'yyyy-MM-dd');
    };

    /**
     * @param {String} template 简单模版
     * @param {Object} param 参数
     */
    du.tpl = function(template) {
        function get(path, param) {
            var base = param;
            var spaths = path.split('.');
            spaths.forEach(function(path) {
                base = base[path];
                if (!base){
                    return '';
                }
            });
            var type = typeof base;
            if (type === 'function'){
                return base();
            }
            if (type !== 'object'){
                return base;
            }
            return '';
        }
        return function(param) {
            return template.replace(/\{([\w\.]+)}/g, function(all, capture) {
                return get(capture, param);
            });
        };
    };
    /**
     * 过滤掉用户粘贴进来的特殊字符导致的JS错误.
     * @param   {String}        str         字符串.
     * @return  {String}        re          过滤后的字符串.
     */
    du.safeJs = function(str) {
        if(!str) {
            return "";
        }
        return str.replace(/[\u2028\u2029]/ig,'');
    };
    /**
     * 判断是否是认证用户，主要用户抽奖等消息使用
     * @return {[type]} [description]
     */
    du.isAuthen = function() {
        return $('.m-account')._$attr('data-authen') != null;
    };
    /**
     * 简单extend
     * @param  {[type]} o1       被覆盖着
     * @param  {[type]} o2       要mixin的对象
     * @param  {[type]} override 是否覆盖
     * @return {Object}          o1
     */
    du.extend = function(o1, o2, override) {
        for (var i in o2) {
            if (o1[i] === undefined || override) {
                o1[i] = o2[i];
            }
        }
        return o1;
    };
    /**
     * [ description]
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    du.toggleActived = function(ev) {
        var $parent = du.$(ev.target)._$parent('.m-rule', true);
        $parent._$toggleClass('actived');
    };
    /**
     * 开始计数
     * @param  {Node} node [description]
     * @param  {Number} time [description]
     * @param  {[type]} text [description]
     * @return {[type]}      [description]
     */
    du.startCount = function(node, time, text) {
        var $node = du.$(node);
        $node._$addClassName('u-btn-dis');
        time = time || 60;
        text = text || '{}秒后重新发送';
        var timer = setInterval(function() {
            if (time <= 0) {
                $node._$delClassName('u-btn-dis')._$text('发送验证码');
                clearInterval(timer);
            } else {
                $node._$text(text.replace('{}', time--));
            }
        }, 1000);
    };
    /**
     * 从form提取对应的JSOn数据
     * @param  {节点} node
     * @return {Object} form表单数据
     */
    du.getFormData = function(node) {
        var result = {};
        $(node)._$children('input,select, textarea', true)._$forEach(function(node) {
            result[node.name] = node.value.trim();
        });
        return result;
    };
    /**
     * 新建群组的时候使用
     * @return {[type]} [description]
     */
    du.getGroupData = function(ev) {
        var $parent = du.$(ev.target)._$parent('.m-rule', true);
        var id = $parent._$attr('data-id');
        var result = du.getFormData($parent);
        var message;
        if (id != null) {
            result.id = id;
        }

        if (!result.manageId) {
            $parent._$find('[name=manageId]')[0].focus();
            message = "管理员易信号不能为空";

        } else if (!result.name || u._$length(result.name) > 30) {
            $parent._$find('[name=name]')[0].focus();
            message = "群名称不能为空，且长度应为1~30个字符";

        } else if (!result.sms && !id) {
            $parent._$find('[name=sms]')[0].focus();
            message = "验证码不能为空";

        } else if (!result.description || u._$length(result.description) > 30) {
            message = "群备注不能为空，且长度应为1~30个字符";
            $parent._$find('[name=description]')[0].focus();

        }
        if (message) {
            result.code = 500;
            result.message = message;
        }

        return result;

    };
    /**
     * 限制触发次数，一般用在input的实时变化的异步请求的次数
     * @param  {[type]} func      [description]
     * @param  {[type]} wait      [description]
     * @param  {[type]} immediate [description]
     * @return {[type]}           [description]
     */
    du.throttle = function(func, wait, immediate) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        var later = function() {
            previous = new Date;
            timeout = null;
            result = func.apply(context, args);
        };
        return function() {
            var now = new Date;
            if (!previous && immediate === false){
                previous = now;
            }
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
            } else if (!timeout) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };
    /**
     * 字符串正则表达式关键字转化
     */
    du.transReg = function(str) {
        var reg = /[\^\.\\\|\(\)\*\+\-\$\[\]\?]/g;
        var map = {
            "^": "\\^",
            ".": "\\.",
            "\\": "\\\\",
            "|": "\\|",
            "(": "\\(",
            ")": "\\)",
            "*": "\\*",
            "+": "\\+",
            "-": "\\-",
            "$": "\$",
            "[": "\\[",
            "]": "\\]",
            "?": "\\?"
        };
        str = str.replace(reg, function(s) {
            return map[s];
        });
        return str;
    };
    /**
     * 富文本匹配关键词高亮
     * @param {Object} node 需匹配区域节点
     * @param {String} word 关键词
     * @param {String} klass 关键词高亮样式
     */
    du.highlight = (function() {
        var highlightWord, tempNodeVal, tempWordVal, pn, nv, ni, before, docWordVal, after, hiwordtext, hiword;
        highlightWord = function(node, word, klass) {
            if (node.hasChildNodes) {
                var i;
                for (i = 0; i < node.childNodes.length; i++) {
                    highlightWord(node.childNodes[i], word, klass);
                }
            }
            if (node.nodeType === 3) {
                tempNodeVal = node.nodeValue.toLowerCase();
                tempWordVal = word.toLowerCase();
                if (tempNodeVal.indexOf(tempWordVal) !== -1) {
                    pn = node.parentNode;
                    if (pn.className !== klass) {
                        nv = node.nodeValue;
                        ni = tempNodeVal.indexOf(tempWordVal);
                        before = document.createTextNode(nv.substr(0, ni));
                        docWordVal = nv.substr(ni, word.length);
                        after = document.createTextNode(nv.substr(ni + word.length));
                        hiwordtext = document.createTextNode(docWordVal);
                        hiword = document.createElement("span");
                        hiword.className = klass;
                        hiword.appendChild(hiwordtext);
                        pn.insertBefore(before, node);
                        pn.insertBefore(hiword, node);
                        pn.insertBefore(after, node);
                        pn.removeChild(node);
                    }
                }
            }
        };
        return function(node, word, klass) {
            if (!node || !word){
                return;
            }
            klass = klass || 'u-key';
            highlightWord(node, word, klass);
        };
    })();
    /**
     * 纯文本匹配关键词高亮
     * @param {String} str 被匹配字符串
     * @param {String} key 关键词
     * @param {String} klass 关键词高亮样式
     */
    du.textHighlight = function(str, key, klass) {
        if (!str || !key){
            return;
        }
        str = u._$escape(str);
        key = du.transReg(key);
        var reg = new RegExp("(" + key + ")", "gi");
        str = str.replace(reg, '<span class="' + (klass || 'u-key') + '">$1</span>');
        return str;
    };

    /**
     * 图文消息关键词高亮
     * @param {String} str 被匹配字符串
     * @param {String} key 关键词
     * @param {String} klass 关键词高亮样式
     */
    du.wordHighlight = function(str, key, klass) {
        if (!key){
            return str;
        }
        key = du.transReg(key);
        var reg = new RegExp("(" + key + ")", "gi");
        str = str.replace(reg, '<i class="' + (klass || 'u-key') + '">$1</i>');
        return str;
    };

    /**
     * 距离当前的时间文案显示 客户端版
     * @param  {Timestamp} ts 时间戳
     */
    du.fromNow = function(ts) {
        //const
        var s = 1000;
        var m = s * 60;
        var h = m * 60;
        var d = h * 24;
        var fl = Math.floor;
        var str = '';

        var now = new Date();
        var past = new Date(ts);
        var pday = '星期' + ['天', '一', '二', '三', '四', '五', '六'][past.getDay()];
        var pmonth = past.getMonth() + 1;
        var pdate = past.getDate();
        var ndate = now.getDate();
        var pyear = past.getFullYear();
        var nyear = now.getFullYear();
        var offset = (+now) - ts;
        var doffset = offset / d;

        // 蛋疼
        if (offset < m * 5) {
            str = '刚刚';
        } else if (offset < h) {
            str = fl(offset / m) + '分钟前';
        } else if (offset < d && ndate === pdate) {
            str = fl(offset / h) + '小时前';
        } else if (doffset < 2 && ndate - pdate === 1) {
            str = '昨天';
        } else if (doffset < 3 && ndate - pdate === 2) {
            str = '前天';
        } else if (doffset < 7) {
            str = pday;
        } else {
            if (nyear - pyear >= 1) {
                str = (pyear + '年' + pmonth + '月' + pdate + '日').slice(2);
            } else {
                str = pmonth + '月' + pdate + '日';
            }
        }
        return str;
    };
    /**
     * 替换文本中的url为超链接
     * @param {String} str 被匹配字符串
     */
    du.urlToLink = function(str) {
        return (str.replace(/(((https?|ftp|file):\/\/|www\.)[-a-zA-Z0-9+&@#\/%?=~_|!:,.;]*)/g, function(all) {
            var url = all;
            if (url.indexOf('www') === 0) {
                url = 'http://' + url;
            }
            return '<a href="' + url + '">' + all + '</a>';
        }));
    };
    /**
     * REST异步请求
     * @param {String} str 被匹配字符串
     */
    du._$requestByREST = function(url, options){
        options.timeout = options.timeout || 10000;
        // HOOK下onload增加onend回调.
        var fld = options.onload;
        options.onload = function(data) {
            if(data&&data.code ===401){
                du.showError(data.message||'会话已过期，请重新登录');
                setTimeout(function(){ location.reload();},2000);
                return;
            }
            fld ? fld.apply(this, arguments) : 0;
            options.onend ? options.onend.apply(this, arguments) : 0;
        };
        if(!options.onerror){
            options.onerror = function(data){
                if(!!data && data.message){
                    if(data.message.indexOf('超时')>-1){
                        du.showError('请求超时！');
                    }else{
                        du.showError(data.message);
                    }
                }else{
                    du.showError('网络异常，请检查后再试');
                }
            };
        }
        // HOOK下onerror增加onend回调.
        var fer = options.onerror;
        options.onerror = function() {
            fer ? fer.apply(this, arguments) : 0;
            options.onend ? options.onend.apply(this, arguments) : 0;
        };
        return j._$request(url, options);
    };
    /**
     * 注册NEJ路由模块.
     * @param       {Object}        p               NEJ导出对象.
     * @param       {String}        nm              模块名.
     * @param       {option}        option          配置参数.
     * @config      {Object}        option.data     数据对象.
     * @config      {String}        option.reg      reg对象参数.
     * @config      {Function}      init            模块初始化触发.
     * @config      {Function}      show            模块展现触发.
     * @config      {Function}      refresh         模块刷新触发.
     * @config      {Function}      hide            模块隐藏触发.
     * @return      {Object}        p               返回输入的NEJ导出对象.
     */
    du.registModule = function(p, nm, option) {
        if(!option) {
            option = {};
        }
        p._$$App = k._$klass();
        var proto = p._$$App._$extend(md._$$ModuleAbstract);
        proto.__doBuild = function(options) {
            this.__super();
            var __getDD = this.__getDD = function() {
                return JSON.parse(JSON.stringify(option.data||{}));
            };
            if(!option.reg) {
                option.reg = {};
            }
            option.reg.template = tpl._$getTextTemplate("module-" + nm);
            option.reg.data = __getDD();
            var Reg = Regular.extend(option.reg);
            option.init ? option.init.call(this, options, Reg) : 0;
            this.__body = document.createElement("div");
            var oreg = new Reg();
            this.reg = oreg.$inject(this.__body);
            var nchildc = e._$getByClassName(this.__body,'j-body')[0];
            if(nchildc) {
                this.__export = {
                    parent : nchildc
                };
            }
        };
        proto.__onShow = function(options) {
            this.__super(options);
            option.show ? option.show.call(this, options) : 0;
        };
        proto.__onRefresh = function(options) {
            this.__super(options);
            // 数据初始化.
            var reg = this.reg;
            reg.data = this.__getDD();
            option.refresh ? option.refresh.call(this, options) : reg.$update();
        };
        proto.__onHide = function() {
            this.__super();
            option.hide ? option.hide.call(this) : 0;
        };
        proto.__onMessage = function(data) {
            option.message ? option.message.call(this, data) : 0;
        };
        md._$regist(nm, p._$$App);
        return p;
    };
    /**
     * 注册NEJ路由模块.
     * @param       {Object}        p               NEJ导出对象.
     * @param       {String}        nm              对应的模板名.
     * @param       {option}        option          配置参数.
     * @config      {Object}        option.data     数据对象.
     * @config      {String}        option.reg      reg对象参数.
     * @config      {Function}      init            模块初始化触发.
     * @config      {Function}      refresh         模块刷新触发.
     * @return      {Object}        p               返回输入的NEJ导出对象.
     */
    du.registAbstract = function(p, nm, option) {
        if(!option){
            option = {};
        }
        p = k._$klass();
        var proto = p._$extend(ui._$$Abstract);
        proto.__init = function(){
            this.__supInit();
        };
        proto.__reset = function(options) {
            this.__supReset(options);
            // 数据初始化.
            var reg = this.reg;
            reg.data = this.__getDD();
            option.refresh ? option.refresh.call(this, options) : reg.$update();
        };
        proto.__destroy = function() {
            this.__supDestroy();
        };
        proto.__initNode = function() {
            this.__supInitNode();
            // 数据.
            var __getDD = this.__getDD = function() {
                return JSON.parse(JSON.stringify(option.data||{}));
            };
            if(!option.reg) {
                option.reg = {};
            }
            option.reg.template = tpl._$getTextTemplate("module-" + nm);
            option.reg.data = __getDD();
            var Reg = Regular.extend(option.reg);
            option.init ? option.init.call(this, Reg) : 0;
            var oreg = new Reg();
            this.reg = oreg.$inject(this.__body);
        };
        return p;
    };
    /**
     * 模块刷新的时候加载状态更新.
     * 第一个参数作为方法，之后的参数作为调用参数，
     * 调用参数的最后一个参数进行延迟触发.
     */
    du.refreshAjax = function() {
        var args = [].slice.apply(arguments);
        var f = args.shift();
        var i = args.length - 1;
        if(typeof args[i] === "function") {
            args[i] = (function(f0){
                return function() {
                    setTimeout(function(){
                        f0.apply(window,arguments);
                    }, 500);
                };
            })(args[i]);
        }
        return f.apply(window,args);
    };
    // 素材是否被引用 提示文案
    du._$referTip = function(data){
        var str = '<h3 class="tlt">该素材已被如下内容引用：</h3>';
        var refers = data.refers;
        var referMap = {"welcome":{href:"/autoreply#/common/?type=0",title:"关注后的欢迎语"}
                        ,"autoreply":{href:"/autoreply#/common/?type=1",title:"消息自动回复"}
                        ,"keyword":{href:"/autoreply#/keyword/?type=2",title:"关键词自动回复"}
                        ,"menu":{href:"/customMenu",title:"自定义菜单"}};
        var feach = function(item) {
            str += '<a href="/material/updateImageText?id=' + item+'" target="_blank">图文素材</a>　';
        };
        for(var i=0,l=refers.length;i<l;i++){
            if(u._$isArray(refers[i])){
                u._$forEach(refers[i], feach);
            }else{
                str += ' <a href="' + referMap[refers[i]].href+'" target="_blank">'+referMap[refers[i]].title+"</a>　";
            }
        }
        return str;
    };
    /**
     * 文本计数 超出限制标红;
     * param    num     输入框文字数
     * param    node    显示字数节点
     * param    limit   字数限制
     */
    du._$countWord = function(num,node,limit){
        if (num <= limit) {
            e._$delClassName(node, 'u-err');
        } else {
            e._$addClassName(node, 'u-err');
        }
        node.innerText = num;
    };

    /**
     * 时间对象的格式化;
     */
    Date.prototype.format = function(format) {
        /*
         * "yyyy-MM-dd hh:mm:ss"
         */
        var o = {
            "M+": this.getMonth() + 1, // month
            "d+": this.getDate(), // day
            "h+": this.getHours(), // hour
            "m+": this.getMinutes(), // minute
            "s+": this.getSeconds(), // second
            "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
            "S": this.getMilliseconds()
            // millisecond
        };

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
     /**
     * 将时间信息转换为时间戳.
     * @param       {String}            字符串时间，例如2014-06-27 12:30
     * @return      {Number}            时间戳
     */
    du.transToTimeSpan = function(_str){
        try{
            if(_str){
                _str = _str?_str.replace(/[-\.]/g,"/"):undefined;
                return parseInt(new Date(_str).valueOf());
            }
            else{
                return parseInt(new Date().valueOf());
            }
        }
        catch(ex){
            return 0;
        }
    };

    du.transIframeSrcToRelativePath = function(str) {
        var reg = new RegExp('((?:<|&lt;)iframe.*?src=(?:"|&quot;))'+window.iframeHost+'(.+?)("|&quot;)', 'ig');
        return str.replace(reg, '$1/$2&inEditor=true$3');
    };

    /**
     * 易信客户端会针对某几个域直接跳转到Iframe的src对应的页面
     * 将Iframe的src换成另一个域来规避这个错误
     * 在updateImageText.ftl里面会将绝对路径重置为相对路径，
     * 这样在https的环境下不会有https和http混合而发生的错误
     * 参见/template/common/function.ftl#transIframeSrcToRelativePath
     * @hzzhangyingya（前端）
     * @yinglei@yixin.im（后端）
     * @louzhe@yixin.im（iOS）
     */
    du.transIframeSrcToProxyHost = function(text) {
        // 如果复制了运营素材，那么Iframe的src就包含了域名
        var protocolHost = '(?:' + location.protocol + '//' + location.host + ')?';
        protocolHost = protocolHost.replace(/\./gi, '\\.');
        var regStr = '(<iframe.*?src=")' + protocolHost + '(\/)((?:wap/operateMaterialCover|wap/audioPlayerCover|res/videoplayer/assets/index.html).+?)(?:&(?:amp;)?inEditor=true)?(")';
        var reg = new RegExp(regStr, 'gi');
        return text.replace(reg, '$1'+window.iframeHost+'$3$4');
    };

    /**
     * 目前所有插入的标签后面都额外插入了一个空格，目的是为了解决Firefox下面焦点失控的问题
     * 但是在viewImageText.ftl里面的img和Iframe都是撑满一行的，所以空格就被挤到下一行
     * 如果用户在插入img和Iframe后换行的话，空格就会占一行，排版很奇怪，
     * 将img和Iframe后面的空格去掉，link后面的空格不用管
     * @hzzhangyingya（前端）
     * @cheng-lin@corp.netease.com（前端技术部）
     */
    du.stripSpaceAfterInsertedTag = function(text) {
        return text.replace(/(<\/iframe>|<img.*?(?:\/)?>)&nbsp;/gi, '$1');
    };

    /**
     * String对象扩展
     */
    String.prototype.LTrim = function() {
        return this.replace(/(\s*$)/g, "");
    };

    /**
     * Array对象的扩展
     */
    Array.prototype.map = Array.prototype.map || function(fn) {
        var arr = this;
        var newArr = [];
        for (var i = 0; i < arr.length; i++) {
            newArr.push(fn(arr[i]));
        }
        return newArr;
    };

    p = du;
    return p;
});