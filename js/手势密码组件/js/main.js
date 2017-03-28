;(function() {

    // 事件注册函数
    function addEvent(ele, type, func) {
        if (ele.addEventListener) {
            ele.addEventListener(type, func, false);
        } else if (ele.attachEvent) {
            ele.attachEvent("on"+type, func);
        } else {
            ele["on"+type] = func;
        }
    }


    var pwCanvas = document.getElementById("pwCanvas"),
        reminder = document.getElementsByClassName("reminder")[0],
        setPW = document.getElementById("setPassword"),
        verifyPW = document.getElementById("verifyPassword");

    // 实例化手势密码组件
    var gesturePassword = new GesturePW(pwCanvas);
    gesturePassword.init({
        reminderEl: reminder,
        savePassword: false,
        resetControl: setPW,
        verifyControl: verifyPW
    });

    addEvent(window, "load", function() {
        setPW.checked = true;
        setPW.focus();
        setPW.blur();
    });

})();

