/**
 * Created by Administrator on 2016/5/15 0015.
 */
define(['jquery','unit'],function($,_){
    var digit =
        [
            [
                [0,0,1,1,1,0,0],
                [0,1,1,0,1,1,0],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [0,1,1,0,1,1,0],
                [0,0,1,1,1,0,0]
            ],//0
            [
                [0,0,0,1,1,0,0],
                [0,1,1,1,1,0,0],
                [0,0,0,1,1,0,0],
                [0,0,0,1,1,0,0],
                [0,0,0,1,1,0,0],
                [0,0,0,1,1,0,0],
                [0,0,0,1,1,0,0],
                [0,0,0,1,1,0,0],
                [0,0,0,1,1,0,0],
                [1,1,1,1,1,1,1]
            ],//1
            [
                [0,1,1,1,1,1,0],
                [1,1,0,0,0,1,1],
                [0,0,0,0,0,1,1],
                [0,0,0,0,1,1,0],
                [0,0,0,1,1,0,0],
                [0,0,1,1,0,0,0],
                [0,1,1,0,0,0,0],
                [1,1,0,0,0,0,0],
                [1,1,0,0,0,1,1],
                [1,1,1,1,1,1,1]
            ],//2
            [
                [1,1,1,1,1,1,1],
                [0,0,0,0,0,1,1],
                [0,0,0,0,1,1,0],
                [0,0,0,1,1,0,0],
                [0,0,1,1,1,0,0],
                [0,0,0,0,1,1,0],
                [0,0,0,0,0,1,1],
                [0,0,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [0,1,1,1,1,1,0]
            ],//3
            [
                [0,0,0,0,1,1,0],
                [0,0,0,1,1,1,0],
                [0,0,1,1,1,1,0],
                [0,1,1,0,1,1,0],
                [1,1,0,0,1,1,0],
                [1,1,1,1,1,1,1],
                [0,0,0,0,1,1,0],
                [0,0,0,0,1,1,0],
                [0,0,0,0,1,1,0],
                [0,0,0,1,1,1,1]
            ],//4
            [
                [1,1,1,1,1,1,1],
                [1,1,0,0,0,0,0],
                [1,1,0,0,0,0,0],
                [1,1,1,1,1,1,0],
                [0,0,0,0,0,1,1],
                [0,0,0,0,0,1,1],
                [0,0,0,0,0,1,1],
                [0,0,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [0,1,1,1,1,1,0]
            ],//5
            [
                [0,0,0,0,1,1,0],
                [0,0,1,1,0,0,0],
                [0,1,1,0,0,0,0],
                [1,1,0,0,0,0,0],
                [1,1,0,1,1,1,0],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [0,1,1,1,1,1,0]
            ],//6
            [
                [1,1,1,1,1,1,1],
                [1,1,0,0,0,1,1],
                [0,0,0,0,1,1,0],
                [0,0,0,0,1,1,0],
                [0,0,0,1,1,0,0],
                [0,0,0,1,1,0,0],
                [0,0,1,1,0,0,0],
                [0,0,1,1,0,0,0],
                [0,0,1,1,0,0,0],
                [0,0,1,1,0,0,0]
            ],//7
            [
                [0,1,1,1,1,1,0],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [0,1,1,1,1,1,0],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [0,1,1,1,1,1,0]
            ],//8
            [
                [0,1,1,1,1,1,0],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [0,1,1,1,0,1,1],
                [0,0,0,0,0,1,1],
                [0,0,0,0,0,1,1],
                [0,0,0,0,1,1,0],
                [0,0,0,1,1,0,0],
                [0,1,1,0,0,0,0]
            ],//9
            [
                [0,0,0,0],
                [0,0,0,0],
                [0,1,1,0],
                [0,1,1,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,1,1,0],
                [0,1,1,0],
                [0,0,0,0],
                [0,0,0,0]
            ]//:
        ];
    var CANVAS_WIDTH = $(".clock-icon")[0].offsetWidth,
        CANVAS_HEIGHT = $(".clock-icon")[0].offsetHeight,
        RADIUS = 2,
        MARGIN_LEFT = 5,
        MARGIN_TOP = 60,
        balls = [];
    var clock_canvas = function(){
        var canvas = document.getElementById("canvas"),
            context = canvas.getContext("2d");

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        var curDate = new Date();
        var timer1 = setInterval(function(){
            if($("#canvas").attr("style") === "display: block;opacity: 1;"){
                render(curDate,context);
                var newDate = new Date();
                if(curDate !== newDate){
                    update.addBalls(curDate,newDate);
                    curDate = update.updateTime(curDate);
                    update.updateBalls();
                }
            }else{
                clearInterval(timer1);
            }
        },50);

    };

    function render(curTime,context){

        var hours = curTime.getHours(),
            minutes = curTime.getMinutes(),
            seconds = curTime.getSeconds();

        context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

        renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),context);
        renderDigit(MARGIN_LEFT + 15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),context); //数字列数为7 2*7+1=15
        renderDigit(MARGIN_LEFT + 30*(RADIUS+1),MARGIN_TOP,10,context);
        renderDigit(MARGIN_LEFT + 39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),context); //冒号列数为4 4*2+1=9
        renderDigit(MARGIN_LEFT + 54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),context);
        renderDigit(MARGIN_LEFT + 69*(RADIUS+1),MARGIN_TOP,10,context);
        renderDigit(MARGIN_LEFT + 78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),context);
        renderDigit(MARGIN_LEFT + 93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),context);

        for(var i=0 ; i<balls.length ; i++){
            context.fillStyle = balls[i].color;
            context.beginPath();
            context.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI);
            context.closePath();
            context.fill();
        }

    }
    function renderDigit(x,y,num,context){
        context.fillStyle = "rgb(0,102,153)";

        for(var i=0 ; i<digit[num].length ; i++){
            for(var j=0 ; j<digit[num][i].length ; j++){

                if(digit[num][i][j] == 1){
                    context.beginPath();
                    context.arc(x+(RADIUS+1)*(2*j+1),y+(RADIUS+1)*(2*i+1),RADIUS,0,2*Math.PI,true);
                    context.closePath();

                    context.fill()
                }

            }
        }
    }

    var update ={

        updateTime: function(curDate){
            var newDate = new Date();
            if(curDate !== newDate){
                return newDate
            }
        }
        ,
        addBalls: function(curDate,newDate){
            var newDate_hours = newDate.getHours(),
                newDate_minutes = newDate.getMinutes(),
                newDate_seconds = newDate.getSeconds();
            var curDate_hours = curDate.getHours(),
                curDate_minutes = curDate.getMinutes(),
                curDate_seconds = curDate.getSeconds();

            if(parseInt(newDate_hours/10) !== parseInt(curDate_hours/10)){
                addBall(MARGIN_LEFT,MARGIN_TOP,parseInt(newDate_hours/10))
            }
            if(parseInt(newDate_hours%10) !== parseInt(curDate_hours%10)){
                addBall(MARGIN_LEFT + 15*(RADIUS+1),MARGIN_TOP,parseInt(newDate_hours%10))
            }

            if(parseInt(newDate_minutes/10) !== parseInt(curDate_minutes/10)){
                addBall(MARGIN_LEFT + 39*(RADIUS+1),MARGIN_TOP,parseInt(newDate_minutes/10))
            }
            if(parseInt(newDate_minutes%10) !== parseInt(curDate_minutes%10)){
                addBall(MARGIN_LEFT + 54*(RADIUS+1),MARGIN_TOP,parseInt(newDate_minutes%10))
            }

            if(parseInt(newDate_seconds/10) !== parseInt(curDate_seconds/10)){
                addBall(MARGIN_LEFT + 78*(RADIUS+1),MARGIN_TOP,parseInt(newDate_seconds/10))
            }
            if(parseInt(newDate_seconds%10) !== parseInt(curDate_seconds%10)){
                addBall(MARGIN_LEFT + 93*(RADIUS+1),MARGIN_TOP,parseInt(newDate_seconds%10))
            }

        }
        ,
        updateBalls: function(){
            for(var i=0 ; i<balls.length ; i++){
                balls[i].x += balls[i].vx;
                balls[i].y += balls[i].vy;
                balls[i].vy += balls[i].g;

                if(balls[i].y >= CANVAS_HEIGHT-RADIUS){
                    balls[i].y = CANVAS_HEIGHT-RADIUS;
                    balls[i].vy = -balls[i].vy*0.58;
                }
            }

            var ballNum = 0;
            for(var i=0 ; i<balls.length ; i++){
                if(balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < CANVAS_WIDTH){
                    balls[ballNum++] = balls[i];
                }
            }
            while(balls.length > ballNum){
                balls.pop();
            }

            console.log(balls.length)
        }
    };

    function addBall(x,y,num){

        for(var i=0 ; i<digit[num].length ; i++){
            for(var j=0 ;j<digit[num][i].length ; j++){

                if(digit[num][i][j] == 1){
                    var aBAll = {
                        x: x+(RADIUS+1)*(2*j+1),
                        y: y+(RADIUS+1)*(2*i+1),
                        g: 2.5+Math.random(),
                        vx: Math.pow(-1,Math.ceil(Math.random()*1000))*4,
                        vy: -5 + Math.pow(-1,Math.ceil(Math.random()*1000))*2,
                        color: "rgb("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+")"
                    };
                    balls.push(aBAll);
                }
            }
        }
    }
    return{
        clock_canvas: clock_canvas
    }
});