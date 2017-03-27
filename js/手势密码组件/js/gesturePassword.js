/**
 * 时间： 2017/03/26
 * 作者： 张子睿
 * 功能： 这是一个手势密码的组件。
 */

;(function() {
    "use strict";

    window.GesturePW = function(el) {
        this.el = el;
        if (!this.el.getContext) {
            console.log("您的浏览器不支持Canvas!");
            return;
        }
        this.context = this.el.getContext("2d");
        this.centerArrs = [];       // 存放每一个圆的圆心
        this.indexArr = [];         // 存放手势滑动的轨迹
        this.passwordArr = [];     // 存放密码
        this.cache = {};            // 存放自定义事件
        this.status = {             // 组件的不同状态
            PENDING: 0,     // 初始状态
            BEGIN: 1,       // 开始设定密码
            SET: 2,         // 第一次密码设定成功，等待重复设定密码
            VERIFY: 3,      // 密码设定成功，等待解锁
            ERROR: 4,       // 密码错误
            CORRECT: 5,     // 密码正确
            RESET: 6        // 重置密码
        };
        this.curStatus = this.status.PENDING;       // 组件当前状态
        this.setting = {                               // 组件的配置
            cSize: 240,     // 设定canvas画布的大小，最好与外部所提供的canvasDOM大小相符，组件认定画布宽高一致
            num: 3,         // 设定画布中圆圈的规模，默认为 3×3
            radius: null,   // 设定圆圈的半径，如果不设定，则自动通过画布大小和圆圈规模计算得出
            initialBorderColor: "#BBBBBB",  // 设定圆圈的初始轮廓颜色
            hoverBorderColor: "#FD8D00",    // 设定滑动过后的轮廓颜色
            correctBorderColor: "green",    // 设定密码正确时的轮廓颜色
            errorBorderColor: "red",        // 设定密码错误时的轮廓颜色
            centerColor: "#FFA723",         // 设定滑动过后的圆圈内部填充颜色
            lineColor: "#FFA723",           // 设定滑动时轨迹线条颜色
            passwordMinimumNum: 5,          // 设定密码至少需要位数，默认至少5位，即至少需要滑过5个圆圈
            savePassword: true,             // 是否保存密码，即下一次打开页面就需要解锁，而不是再次设置密码，默认保存
            resetControl: null,             // 设定密码重置，参数接受外部dom元素。如果设定了dom元素，组件认定点击该元素，则密码重置 （不设定，组件仍可运行，但是密码设定后无法重置密码）
            verifyControl:null,             // 设定密码验证，参数接受外部dom元素。如果设定了dom元素，组件认定点击该元素，如果存在密码，则开始验证密码（不设定，组件仍可正常运行）
            reminderEl: null                // 设定提示语, 参数接受外部dom元素。如果设定了dom元素，组件认定点该元素显示组件不同状态提示语
        };
    };

    // 配置继承
    GesturePW.prototype._extend = function(setting, option) {
        var item = null;
        for (item in option) {
            setting[item] = option[item];
        }
    };

    // 事件注册函数
    GesturePW.prototype._addEvent = function(ele, type, func) {
        if (ele.addEventListener) {
            ele.addEventListener(type, func, false);
        } else if (ele.attachEvent) {
            ele.attachEvent("on"+type, func);
        } else {
            ele["on"+type] = func;
        }
    };

    // 获取传入元素离页面边缘的距离
    GesturePW.prototype._getOffset = function(ele) {
        var auxNode = ele.offsetParent,
            left = ele.offsetLeft,
            top = ele.offsetTop;
        while (auxNode !== null) {
            left += auxNode.offsetLeft;
            top += auxNode.offsetTop;
            auxNode = auxNode.offsetParent;
        }
        return {
            left: left,
            top: top
        }
    };

    // 判断是否为Number类型
    GesturePW.prototype._isNumber = function(num) {
        return Object.prototype.toString.call(num) == "[object Number]";
    };

    // 判断是否为String类型
    GesturePW.prototype._isString = function(str) {
        return Object.prototype.toString.call(str) == "[object String]";
    };

    // 设定localStorage
    GesturePW.prototype._setStorage = function(key, value) {
        localStorage.setItem("zzr_"+key, value);    //为防止键值冲突，加上前置
    };

    // 获取localStorage
    GesturePW.prototype._getStorage = function(key) {
        return localStorage.getItem("zzr_"+key);
    };

    // 阻止默认事件
    GesturePW.prototype._preventDefault = function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    };

    // 绑定自定义事件函数
    GesturePW.prototype.on = function(type, callback) {
        if (this.cache[type] == undefined) {
            this.cache[type] = [];
        }
        this.cache[type].push(callback);
    };

    // 触发自定义事件函数
    GesturePW.prototype.trigger = function(type) {
        var fnArr = this.cache[type];
        if (fnArr == undefined) {
            return;
        }
        for (var i=0; i<fnArr.length; i++) {
            fnArr[i]();
        }
    };

    // 组件初始化
    GesturePW.prototype.init = function(option) {
        this._extend(this.setting, option);
        this.renderUI();
        this.bind();
    };

    // 渲染UI界面
    GesturePW.prototype.renderUI = function() {
        this.generateCenterArrs();
        this.renderBaseCircle();
    };

    // 获取每一个圆圈的圆心在canvas中的坐标
    GesturePW.prototype.generateCenterArrs = function() {
        var cSize = null,
            radius = null,
            num = null;
        cSize = parseFloat(this.setting.cSize);
        num = parseFloat(this.setting.num);
        this.el.width = cSize;
        this.el.height = cSize;
        cSize = cSize - 10;     // 给画布上下左右各留5px，以免渲染效果被遮挡
        this.setting.radius = this.setting.radius || Math.floor(cSize/(2*num-1)/2);
        radius = parseFloat(this.setting.radius);
        if (2*radius * num > cSize) {     // 如果圆圈个数和圆圈大小超过了画布大小，则抛出错误
            throw new Error("大小设置不合理！");
        }
        var distance = Math.floor((cSize - 2*radius * num)/(num -1)),
            centerArr = [];
        for (var i=0; i<num; i++) {
            for (var j=0; j<num; j++) {
                centerArr.push(5+j*(2*radius+distance)+radius);
                centerArr.push(5+i*(2*radius+distance)+radius);
                this.centerArrs.push(centerArr);    // 将圆心坐标存入this.centerArrs中
                centerArr = [];
            }
        }
    };

    // 组件的事件注册函数 （观察者模式）
    GesturePW.prototype.bind = function() {
        var that = this;

        // 注册 touchstart 事件
        this._addEvent(that.el, "touchstart", function(event) {
            var e = event || window.event,
                index = that.getCenter(e);  // index为划过的圆圈的索引
            that._preventDefault(e);
            if (index === false) {      // 如果手势没有滑过圆圈，则不做处理
                return;
            } else {
                if (that.indexArr.indexOf(index) == -1) {
                    that.indexArr.push(index);      // that.indexArr 记录滑过圆圈的索引，即轨迹
                }
                that.renderCenter(index);   // 渲染滑过的圆圈
                if (that.curStatus == that.status.PENDING) {    //改变组件状态
                    that.curStatus = that.status.BEGIN;
                }
            }
        });

        // 注册 touchmove 事件
        this._addEvent(that.el, "touchmove", function(event) {
            that._preventDefault(e);
            if (that.indexArr.length == 0) {    // 如果手势没有滑过圆圈，则不做处理
                return;
            }
            var e = event || window.event,
                index = that.getCenter(e);
            if (index !== false && that.indexArr.indexOf(index) == -1) {
                that.indexArr.push(index);      // that.indexArr 记录滑过圆圈的索引，即轨迹
            }
            that.updateCanvas(e);   // 更新canvas画布

        });

        // 注册 touchend 事件
        this._addEvent(that.el, "touchend", function() {
            that._preventDefault(e);
            if (that.indexArr.length == 0) {    // 如果手势没有滑过圆圈，则不做处理
                return;
            }

            // 组件不同的状态触发不同的事件
            if (that.curStatus == that.status.BEGIN || that.curStatus == that.status.SET || that.curStatus == that.status.RESET) {
                that.trigger("lock");
            }
            if (that.curStatus == that.status.VERIFY || that.curStatus == that.status.CORRECT || that.curStatus == that.status.ERROR) {
                that.trigger("unlock");
                that.updateCanvas(that.indexArr.slice(-1)[0]);
            }

            // 滑动事件结束后，清空滑动的轨迹数组，渲染初始界面
            setTimeout(function() {
                that.indexArr = [];
                that.renderBaseCircle();
                if (that.curStatus == that.status.CORRECT || that.curStatus == that.status.ERROR) {
                    that.curStatus = that.status.VERIFY;
                }
            }, 400);
        });

        // 自定义 设置密码 事件
        this.on("lock", function() {
            // 如果设置了密码保存并且存在密码，则不能设定密码，跳出设置密码事件
            if (that.setting.savePassword && that._getStorage("gesturePassword")) {
                that.curStatus = that.status.VERIFY;
                return;
            }

            // 第一次设定密码
            if (that.curStatus === that.status.BEGIN || that.curStatus === that.status.RESET) {
                if (that.indexArr.length >= that.setting.passwordMinimumNum) {
                    that.curStatus = that.status.SET;
                    that.passwordArr = that.indexArr;
                    if (that.setting.reminderEl) {
                        that.setting.reminderEl.innerHTML ="请再次输入手势密码";
                    }
                } else {
                    if (that.setting.reminderEl) {
                        that.setting.reminderEl.innerHTML ="密码太短，至少需要5个点";
                    }
                }
            } else if (that.curStatus === that.status.SET) {    // 第二次重复设定密码
                if (that.indexArr.join("") === that.passwordArr.join("")) {
                    setTimeout(function() {
                        that.curStatus = that.status.VERIFY;
                        if (that.setting.verifyControl && that.setting.verifyControl.nodeName.toLowerCase() == "input" && document.activeElement != that.setting.verifyControl) {
                            that.setting.verifyControl.checked = true;
                            that.setting.verifyControl.focus();
                            that.setting.verifyControl.blur();
                        }
                    }, 0);
                    that._setStorage("gesturePassword", that.passwordArr.join(""));
                    if (that.setting.reminderEl) {
                        that.setting.reminderEl.innerHTML = "密码设置成功";
                    }
                } else {
                    that.curStatus = that.status.BEGIN;
                    if (that.setting.reminderEl) {
                        that.setting.reminderEl.innerHTML ="两次输入不一致";
                    }
                }
            }
        });

        // 自定义 解锁 事件
        this.on("unlock", function() {
            if (that.curStatus === that.status.VERIFY) {
                if (that.indexArr.join("") == that._getStorage("gesturePassword")) {
                    that.curStatus = that.status.CORRECT;
                    if (that.setting.reminderEl) {
                        that.setting.reminderEl.innerHTML ="密码正确！";
                    }
                } else {
                    that.curStatus = that.status.ERROR;
                    if (that.setting.reminderEl) {
                        that.setting.reminderEl.innerHTML ="输入的密码不正确！";
                    }
                }
            }
        });

        // 自定义 重置 事件
        this.on("reset", function() {
            if (that.curStatus == that.status.VERIFY || that.curStatus == that.status.PENDING || that.curStatus == that.status.BEGIN || that.curStatus == that.status.RESET) {
                that.curStatus = that.status.RESET;
                if (that.setting.reminderEl) {
                    that.setting.reminderEl.innerHTML = "请输入手势密码！";
                }
            }
        });

        // 自定义 密码验证 事件
        this.on("verify", function() {
            if (that.curStatus != that.status.VERIFY) {
                if (that.setting.reminderEl) {
                    that.setting.reminderEl.innerHTML = "密码未设置！";
                } else {
                    alert("密码未设置！");
                }
            }
        });

        // 如果配置设定了外部重置密码dom元素，则注册该元素的点击或聚焦事件
        if (this.setting.resetControl) {
            if (this.setting.resetControl.nodeName.toLowerCase() == "input") {
                this._addEvent(this.setting.resetControl, "focus", function() {
                    that.trigger("reset");
                });
            } else {
                this._addEvent(this.setting.resetControl, "click", function() {
                    that.trigger("reset");
                });
            }
        }

        // 如果配置设定了外部设定dom元素，则注册该元素的点击或聚焦事件
        if (this.setting.verifyControl) {
            if (this.setting.verifyControl.nodeName.toLowerCase() == "input") {
                this._addEvent(this.setting.verifyControl, "focus", function() {
                    that.trigger("verify");
                });
            } else {
                this._addEvent(this.setting.verifyControl, "click", function() {
                    that.trigger("verify");
                });
            }
        }
    };

    // 设置密码重置的方法
    GesturePW.prototype.reset = function() {
        this.trigger("reset");
    };

    // 获取鼠标在Canvas画布中的坐标
    GesturePW.prototype.getPosition = function(e) {
        var offsetL = this._getOffset(this.el).left,
            offsetT = this._getOffset(this.el).top,
            x = e.touches[0].clientX - offsetL - 5,
            y = e.touches[0].clientY - offsetT - 5,
            position = [];
        position.push(x);
        position.push(y);
        return position;
    };

    // 查看鼠标是否进入了圆圈内部，如果进入，返回该圆圈的索引，如果没有进入，则返回false
    GesturePW.prototype.getCenter = function(e) {
        var position = this.getPosition(e),
            distanceArr = [],
            x = position[0],
            y = position[1],
            that = this;

        // 计算鼠标离每一个圆心的距离
        this.centerArrs.forEach(function(item) {
            distanceArr.push(Math.floor(Math.sqrt(Math.pow((x-item[0]), 2) + Math.pow((y-item[1]), 2))));
        });

        // 查看距离是否小于圆圈半径
        var indexArr = distanceArr.filter(function(item, index) {
            return item < that.setting.radius;
        });

        if (indexArr.length == 0) {
            return false;
        } else if (indexArr.length == 1) {
            return distanceArr.indexOf(indexArr[0]);
        } else {
            // 如果抛出该错误，证明存在边界条件作者没有考虑到，组件出现BUG。
            throw new Error("Error: BUG! (有某些情况没有考虑到)");
        }
    };

    // 渲染初始界面
    GesturePW.prototype.renderBaseCircle = function() {
        this.context.clearRect(0, 0, this.el.width, this.el.height);
        for (var i= 0, len=this.centerArrs.length; i<len; i++) {
            var centerArr = this.centerArrs[i];
            this.context.beginPath();
            this.context.lineWidth = 2;
            this.context.strokeStyle = this.setting.initialBorderColor;
            this.context.arc(centerArr[0], centerArr[1], parseFloat(this.setting.radius), 0, 2*Math.PI, false);
            this.context.stroke();
            this.context.closePath();
        }
    };

    // 渲染滑动过后的圆圈
    GesturePW.prototype.renderCenter = function(index) {
        this.context.beginPath();
        this.context.fillStyle = this.setting.centerColor;
        this.context.arc(this.centerArrs[index][0], this.centerArrs[index][1], parseFloat(this.setting.radius)*0.6, 0, 2*Math.PI, false);
        this.context.fill();
        this.context.closePath();
        this.context.beginPath();
        this.context.strokeStyle = this.setting.hoverBorderColor;
        if (this.curStatus === this.status.ERROR) {
            this.context.strokeStyle = this.setting.errorBorderColor;
        } else if (this.curStatus === this.status.CORRECT) {
            this.context.strokeStyle = this.setting.correctBorderColor;
        }
        this.context.arc(this.centerArrs[index][0], this.centerArrs[index][1], parseFloat(this.setting.radius), 0, 2*Math.PI, false);
        this.context.stroke();
        this.context.closePath();
    };

    // 渲染滑动时的线条轨迹
    GesturePW.prototype.renderLine = function(index, e) {
        var position;

        //参数e可能是滑动的事件，也可能直接是圆心的索引，所以需要判断
        if ((arguments[1] !== undefined) && (this._isNumber(arguments[1]) || this._isString(arguments[1]))) {
            position = this.centerArrs[arguments[1]];
        } else {
            position = this.getPosition(e);
        }
        this.context.beginPath();
        this.context.strokeStyle = this.setting.lineColor;
        this.context.lineWidth = 2;
        this.context.moveTo(this.centerArrs[index][0], this.centerArrs[index][1]);
        this.context.lineTo(position[0], position[1]);
        this.context.stroke();
        this.context.closePath();
    };

    // 更新整个canvas画布
    GesturePW.prototype.updateCanvas = function(e) {
        var that = this,
            len = this.indexArr.length;
        this.renderBaseCircle();
        for (var i=0; i<len; i++) {
            this.renderCenter(this.indexArr[i]);
        }
        if (len <= 1) {
            this.renderLine(this.indexArr[0], e);
        } else {
            var index = this.indexArr.reduce(function(pre, cur) {
                that.renderLine(pre, cur);
                return cur;
            });
            this.renderLine(index, e);
        }
    };

})();