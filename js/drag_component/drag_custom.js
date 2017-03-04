/**
 * Created by Administrator on 2016/6/28 0028.
 */


function Drag(id){
    this.obj = document.getElementById(id);
    this.disX = 0;
    this.disY = 0;
    this.setting = {
    /*目前默认配置为空*/
    }
}
Drag.prototype.init = function(option){

    var that = this;

    extend(this.setting,option); //配置参数

    this.obj.onmousedown = function(event){
        event = event ? event : window.event;
        that.fnDown(event);

        fireEvent(that,"toDown");
    }
};

Drag.prototype.fnDown = function(event){

    var that = this;
    this.disX = event.clientX - this.obj.offsetLeft;
    this.disY = event.clientY - this.obj.offsetTop;

    document.onmousemove = function(event){
        event = event ? event : window.event;
        that.fnMove(event);
    };
    document.onmouseup = function(){
        fireEvent(that,"toUp");
        document.onmousemove = null;
        document.onmouseup = null;
    };
};

Drag.prototype.fnMove = function(event){
    this.obj.style.top = event.clientY - this.disY + "px";
    this.obj.style.left = event.clientX - this.disX + "px";
};


function extend(def,option){
    for( var att in option){
        def[att] = option[att];
    }
    return def;
}



var bindEvent = function(element,event,handler){

    element.listeners = element.listeners || {};
    element.listeners[event] = element.listeners[event] || [];
    element.listeners[event].push(handler);

    if(element.nodeType){
        if(element.addEventListener){
            element.addEventListener(event,handler,false);
        }else if(element.attachEvent){
            element.attachEvent("on"+event,handler);
        }else{
            element["on"+event] = handler;
        }
    }

};

/**
 * 主动触发自定义事件
 * @param element   元素
 * @param event     事件
 */
function fireEvent(element,event){
    if(element.listeners && element.listeners[event]){
        for(var i=0 ; i<element.listeners[event].length ; i++){
            element.listeners[event][i]();
        }
    }
}

window.onload = function(){
    var drag1 = new Drag("id1");
    drag1.init(
        {
            /*目前配置为空*/
        }
    );
    /*将自定义行为分开出来*/
    bindEvent(drag1,"toDown",function(){
        document.title = "hello";
    });

    var drag2 = new Drag("id2");
    drag2.init(
        {
            /*目前配置为空*/
        }
    );
    /*将自定义行为分开出来*/
    bindEvent(drag1,"toUp",function(){
        document.title = "world";
    });
};
