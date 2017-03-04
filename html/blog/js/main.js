/**
 * 2016/4/2
 * AMD 主入口
 *
 * @file    main.js
 * @author  Zhangzirui(411489774@qq.com)
 *
 */
requirejs.config({
    paths:{
        jquery: 'jquery-1.12.3.min',
        dir: 'generateDirectory'
    }
});
require(['dir','unit','jquery','canvas'],function(dir,_,$,canvas){

    /*如果在主页*/
    if($(".clock-icon")){

        _.addEvent($(".clock-icon")[0],"mouseover",function(e){
            if(_.checkHover(e,this)){
                $("#canvas").attr("style","display: block;opacity: 1;");
                canvas.clock_canvas();
            }


        });

        _.addEvent($(".clock-icon")[0],"mouseout",function(e){
            if(_.checkHover(e,this)){
                $("#canvas").attr("style","display: none;opacity: 0;");
            }
        })
    }



    dir.generate_dir();



    if($(".aside-content")[0]){
        _.addEvent($(".aside-content")[0],"click",function(e){
            var event = _.EventUnit.getEvent(e),
                target = _.EventUnit.getTarget(event);
            if(target.tagName === "A"){
                var e_id = target.id,
                    h2_index = e_id.slice(7,8);
                if(e_id.search("h3") === -1){
                    _.scroll(_.getPosition($("#h2-"+h2_index)[0])-20);
                }else{
                    var h3_index = e_id.slice(-1);
                    _.scroll(_.getPosition($(".h2-"+h2_index+"-h3")[h3_index])-20);
                }
            }
        });
    }

});