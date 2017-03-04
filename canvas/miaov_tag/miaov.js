var tagsNode = document.getElementById('tags'),
	aNode = document.getElementsByTagName('a'),
	radius = 150,
	angleX = Math.PI / 360 * Math.random(),	//旋转角度，用来控制旋转的速度
	angleY = Math.PI / 360 * Math.random(),
	tags = [],
	ACTIVE = true;


var initAll = function(){

	var theta = 0,
		phi = 0,
		circleX,circleY,circleZ;

	for(var i=0 ; i<aNode.length ; i++){
		theta = Math.acos(-1+(2*i+1)/aNode.length);
		phi = Math.sqrt(aNode.length*Math.PI) * theta;
		circleX = radius * Math.sin(theta) * Math.cos(phi);
		circleY = radius * Math.sin(theta) * Math.sin(phi);
		circleZ = radius * Math.cos(theta);
		var aTag = new BallElement(aNode[i],circleX,circleY,circleZ);
		aNode[i].style.color = "rgb("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+")";
		tags.push(aTag);
		aTag.update();
	}

	tagsNode.onmouseover=function ()
	{
		ACTIVE = true;
	};

	tagsNode.onmousemove = function(e){
		var mouseEvent = window.event || e,
			mouseX = mouseEvent.clientX - (tagsNode.offsetLeft + tagsNode.offsetWidth/2),
			mouseY = mouseEvent.clientY - (tagsNode.offsetTop + tagsNode.offsetHeight/2);

		angleX = -mouseY * 0.0008;
		angleY =  -mouseX * 0.0008;
	};
	tagsNode.onmouseout = function(){
		ACTIVE = false;

	};
	setInterval(function(){
		ballAnimate();
	},60);
};

var rotateF = {
	rotateX: function(){
		tags.forEach(function(item,index,array){
			var y1 = item.cy * Math.cos(angleX) - item.cz * Math.sin(angleX);
			var z1 = item.cz * Math.cos(angleX) + item.cy * Math.sin(angleX);
			item.cy = y1;
			item.cz = z1;
		})
	}
	,
	rotateY: function(){
		tags.forEach(function(item,index,array){
			var x1 = item.cx * Math.cos(angleY) - item.cz * Math.sin(angleY);
			var z1 = item.cz * Math.cos(angleY) + item.cx * Math.sin(angleY);
			item.cx = x1;
			item.cz = z1;
		})
	}
	//,
	////绕Z轴旋转再本程序中用不到，这里只是都想写出来而已
	//rotateZ: function(){
	//	tags.forEach(function(item,index,array){
	//		item.cx = item.cx * Math.cos(angleZ) - item.cy * Math.sin(angleZ);
	//		item.cy = item.cx * Math.sin(angleZ) + item.cy * Math.cos(angleZ);
	//	})
	//}
};





function BallElement(self,x,y,z){
	this.self = self;
	this.cx = x;
	this.cy = y;
	this.cz = z;
}
BallElement.prototype = {
	constructor: BallElement,
	update:	function(){
		var scale = (this.cz + 2*radius) / (2*radius);
		this.self.style.left = this.cx + tagsNode.offsetWidth/2 - this.self.offsetWidth/2 + "px";
		this.self.style.top = this.cy + tagsNode.offsetHeight/2 - this.self.offsetHeight/2 + "px";
		this.self.style.fontSize = 15 * scale + "px";
		this.self.style.opacity = (this.cz + 2*radius) / (30*radius)*10;
		this.self.style.zIndex = parseInt(scale*10);
	}
};

function ballAnimate(){
	rotateF.rotateX();
	rotateF.rotateY();

	if(!ACTIVE){
		angleX = angleX*0.92;
		angleY = angleY*0.92;
	}
	if(Math.abs(angleX)<=0.0001 && Math.abs(angleY)<=0.0001)
	{
		return;
	}

	tags.forEach(function(item,index,array){
		item.update();
	})
}

initAll();