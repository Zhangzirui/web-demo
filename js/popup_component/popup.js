/**
 * Created by Administrator on 2016/7/14 0014.
 */

window.onload =function(){
    var btn = document.getElementsByTagName("button");
    btn[0].onclick = function(){
        var btn1 = new Popup();
        btn1.init({
            location: "center",
            title: "登陆",
            index: 0
        })
    };
    btn[1].onclick = function(){
        var btn1 = new Popup();
        btn1.init({
            w: 200,
            location: "R_B",
            title: "公告",
            index: 1
        })
    };
    btn[2].onclick = function(){
        var btn1 = new Popup();
        btn1.init({
            w: 400,
            h: 400,
            location: "center",
            title: "登陆",
            index: 2,
            hasMark: true
        })
    };
};

function Popup(){
    this.obj = null;
    this.mark = null;
    this.setting = {
        w: 300,
        h: 300,
        location: "center",
        title: "标题",
        index: null,
        hasMark: false
    }
}

Popup.prototype.init = function(config){

    //配置参数
    extend(this.setting,config);

    //构建单体模式（让程序关闭前只能执行一次）（若程序自动关闭，则不需要这样做）
    if(this.indexArr[this.setting.index] == undefined){
        this.indexArr[this.setting.index] = true;
    }
    if(this.indexArr[this.setting.index]){
        this.createPopup();

        if(this.setting.hasMark){
            this.createMark();
        }
        this.fnClose();
        this.indexArr[this.setting.index] = false;
    }

};

Popup.prototype.createPopup = function(){
    this.obj = document.createElement("div");
    this.obj.className = "popup";
    this.obj.innerHTML = "<div class='title'><span>" + this.setting.title + "</span><span class='popup-close'>X</span></div><div class='content'></div>";
    this.obj.style.width = this.setting.w + "px";
    this.obj.style.height = this.setting.h + "px";

    document.body.appendChild(this.obj);

    if(this.setting.location === "center"){
        this.obj.style.left = (getClientSize().clientW - this.obj.offsetWidth)/2 + "px";
        this.obj.style.top = (getClientSize().clientH - this.obj.offsetHeight)/2 + "px";
    }else if(this.setting.location === "R_B"){
        this.obj.style.left = getClientSize().clientW - this.obj.offsetWidth + "px";
        this.obj.style.top = getClientSize().clientH - this.obj.offsetHeight + "px";
    }



};

Popup.prototype.indexArr = {};

Popup.prototype.createMark = function(){
    this.mark = document.createElement("div");
    this.mark.id = "mark";
    this.mark.style.width = getClientSize().clientW + "px";
    this.mark.style.height = getClientSize().clientH + "px";
    document.body.appendChild(this.mark);
};
Popup.prototype.fnClose = function(){
    var closeNode =  this.obj.getElementsByClassName("popup-close")[0];
    var that = this;
    closeNode.onclick = function(){
        document.body.removeChild(that.obj);
        if(that.setting.hasMark){
            document.body.removeChild(that.mark);
        }
        that.indexArr[that.setting.index] = true;
    };

};

function extend(def,configuration){
    for(var att in configuration){
        def[att] = configuration[att];
    }
    return def;
}

var getClientSize = function(){
    var clientW,clientH;
    if(document.compatMode == "BackCompat"){
        clientW = document.body.clientWidth;
        clientH = document.body.clientHeight;
    }else{
        clientW = document.documentElement.clientWidth;
        clientH = document.documentElement.clientHeight;
    }
    return{
        clientW: clientW,
        clientH: clientH
    }
};