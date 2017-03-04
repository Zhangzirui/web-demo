/**
 * Created by Administrator on 2016/6/28 0028.
 */


function Drag(id){
    this.obj = document.getElementById(id);
    this.disX = 0;
    this.disY = 0;
    this.setting = {
        toDown: function(){},
        toUp: function(){}
    }
}
Drag.prototype.init = function(config){

    var that = this;

    extend(this.setting,config);

    this.obj.onmousedown = function(event){
        event = event ? event : window.event;
        that.fnDown(event);

        that.setting.toDown();
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
        that.setting.toUp();
        document.onmousemove = null;
        document.onmouseup = null;
    };
};

Drag.prototype.fnMove = function(event){
    this.obj.style.top = event.clientY - this.disY + "px";
    this.obj.style.left = event.clientX - this.disX + "px";
};


function extend(def,configuration){
    for( var att in configuration ){
        def[att] = configuration[att];
    }
    return def;
}


window.onload = function(){
    var drag1 = new Drag("id1");
    drag1.init(
        {
            toDown: function(){
                document.title = "按下";
            }
        }
    );

    var drag2 = new Drag("id2");
    drag2.init(
        {
            toUp: function(){
                document.title = "抬起";
            }
        }
    );
};
