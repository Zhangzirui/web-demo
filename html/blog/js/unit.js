/**
 * Created by Administrator on 2016/4/29 0029.
 */
define(['jquery'],function($){

    /**
     * 绑定事件
     * @param   {Element}   element DOM元素
     * @param   {String}    event   事件名称
     * @param   {Function}  listener    绑定的函数
     */
    var addEvent = function(element,event,listener){
        if(element.addEventListener){
            element.addEventListener(event,listener,false);
        }else if(element.attachEvent){
            element.attachEvent("on"+event,listener);
        }else{
            element["on"+event] = listener;
        }
    };

    /**
     * 获取当前事件
     * @param   {String}    event   事件
     * @return  对event对象的引用
     */
    var EventUnit = {
        getEvent: function(event){
            return event ? event : window.event;
        },
        getTarget: function(event){
            return event.target || event.srcElement;
        }
    };

    /**
     * 获得元素距离页面顶部的高度
     */
    var getPosition = function(element){
        var absoluteTop = element.offsetTop;
        var current = element.offsetParent;
        while( current !== null){
            absoluteTop += current.offsetTop;
            current = current.offsetParent;
        }
        return absoluteTop
    };

    /**
     * 实现滚动效果
     * @param {number} objTop 想要滚动到的目标高度
     */
    var scroll = function(objTop){
        var i = 0,
            currentTop = document.body.scrollTop || document.documentElement.scrollTop;
        if(currentTop <= objTop){
            i = currentTop;
            var timer = setInterval(function(){
                document.body.scrollTop = document.documentElement.scrollTop = i;
                if(i >= objTop - 20){
                    document.body.scrollTop = document.documentElement.scrollTop = objTop;
                    clearInterval(timer);
                }
                i = i + 20;
            },10);
        }else{
            i = currentTop;
            var timer = setInterval(function(){
                document.body.scrollTop = document.documentElement.scrollTop = i;
                if(i <= objTop + 20){
                    document.body.scrollTop = document.documentElement.scrollTop = objTop;
                    clearInterval(timer);
                }
                i = i - 20;
            },10);
        }
    };



    /**
     * 防止mouseover及mouseout事件重复触发
     * @param {Element} e 事件对象
     * @param {Element} target 目标对象
     */
    var checkHover = function(e,target){
        if (EventUnit.getEvent(e).type=="mouseover")  {
            return !contains(target,EventUnit.getEvent(e).relatedTarget||EventUnit.getEvent(e).fromElement) && !((EventUnit.getEvent(e).relatedTarget||EventUnit.getEvent(e).fromElement)===target);
        } else {
            return !contains(target,EventUnit.getEvent(e).relatedTarget||EventUnit.getEvent(e).toElement) && !((EventUnit.getEvent(e).relatedTarget||EventUnit.getEvent(e).toElement)===target);
        }
    };
    function contains(parentNode, childNode) {
        if (parentNode.contains) {
            return parentNode != childNode && parentNode.contains(childNode);
        } else {
            return !!(parentNode.compareDocumentPosition(childNode) & 16);
        }
    }




    return{
        addEvent: addEvent,
        EventUnit: EventUnit,
        scroll: scroll,
        getPosition: getPosition,
        checkHover: checkHover
    }
});