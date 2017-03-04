/**
 * Created by Administrator on 2016/4/29 0029.
 */
define(['jquery'],function($){


    var generate_dir =function(){
        var h2_title = null;
        if($(".post h2")){
            h2_title = $(".post h2");
            get_title(h2_title)
        }
        for(var i=0 ; i<h2_title.length ; i++){
            var context = null,
                context2 = "";

            if($(".h2-"+i+"-h3").length !== 0){
                for(var j=0 ; j<$(".h2-"+i+"-h3").length;j++){
                    var context2 = context2 + "<li><a id='dir-h2-"+ i +"-h3-"+ j +"'>" + $(".h2-"+i+"-h3")[j].textContent +"</a></li>"
                }
                context2 = "<ul>" + context2 +"</ul>"
            }
            context = "<li><a id='dir-h2-"+ i +"'>" + h2_title[i].textContent + "</a>" + context2 +"</li>";


            $(".aside-content").append(context)
        }
    };

    function get_title(h2_title){

        for(var i=0 ; i<h2_title.length ; i++){
            h2_title[i].setAttribute("id","h2-" + i);
            if($(".post h2~h3")){
                $(".post h2:eq(" + i +")~h3").attr("class","h2-" + i + "-h3");
            }
        }

    }

    return{
        generate_dir: generate_dir
    }
});