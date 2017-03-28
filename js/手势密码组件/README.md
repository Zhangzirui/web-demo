## 360前端星作业

> 只支持手机端展示

![](https://github.com/Zhangzirui/web-demo/blob/master/js/手势密码组件/img/gesturePW.png)

### 作业信息

- 题目： 完成手势密码前端UI组件
- 完成人： 张子睿
- 完成时间： 2017/03/28

### 作业代码说明

#### 思路：

组件嘛，大体框架肯定是构造函数，函数里面写每次都要实例化的属性，然后构造函数原型上面写通用的方法。
	
- 在构造函数里面：

	- 手势密码，肯定要用canvas画图，首先判断能不能支持canvas；
	- 其次是需要有记录手势滑动过圆圈的索引的数组和记录正确密码的数组；
	- 然后，密码有开始设定，第二次设定，验证密码，正确，错误这些状态，所以需要设定一个当前状态值和一个存在所有状态的对象，用来在不同情况下进行比较看进入哪一个状态；
	- 肯定有自定义事件，需要一个对象存储自定义事件；
	- 最后就是一些配置，可以供用户自行配置，比如canvas画布大小，圆圈规模是3×3还是更大，圆圈半径，密码最小长度，还有各种UI的颜色等等。

- 在构造函数原型的方法里面：

	- 一些基本的函数： 跨浏览器的绑定事件函数，配置localStorage函数, 用户配置继承extend函数，自定义事件和触发的函数，获取元素在页面中的位置等等。
	- 一系列渲染UI的方法：画圆圈，画手势路径等；
	- 事件注册的函数，先绑定一些事件方法，用观察者模式开发，需要的时候就触发事件名称即可；
	- init方法，在组件生成时开始渲染初始界面和执行逻辑操作。

> 注意touchmove事件，要阻止默认事件，防止屏幕滚动和安卓机的bug。

#### 难点：

- 计算层面： 计算渲染好的界面中各各圆心的位置，鼠标的位置，是否进入圆圈，是该画线条还是该画圆圈等等。
- 逻辑层面： 处理好各各状态之间的衔接，不要出漏洞。

#### 使用：

1. 引入

		    <script type="text/javascript" src="js/gesturePassword.js"></script>
			<script type="text/javascript">
				var gesturePassword = new GesturePW(canvasDOM);	//其中canvasDOM是外部canvas元素，需要用户提供
			    gesturePassword.init();
			</script>
	
	> canvasDOM 不要设置宽高，在下面配置中设定即可。

2. 配置
	
	可供配置的选项：

		 this.setting = {   // 组件的配置
            cSize: 240,     // 设定canvas画布的大小，组件认定画布宽高一致
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
            resetControl: null,             // 设定密码重置，参数接受外部dom元素。如果设定了dom元素，组件认定点击该元素，则密码重置 （不设定，组件仍可正常运行）
            verifyControl:null,             // 设定密码验证，参数接受外部dom元素。如果设定了dom元素，组件认定点击该元素，如果存在密码，则开始验证密码（不设定，组件仍可正常运行）
            reminderEl: null                // 设定提示语, 参数接受外部dom元素。如果设定了dom元素，组件认定点该元素显示组件不同状态提示语
        };

	配置方法：
	
		gesturePassword.init({
			reminderEl: reminderDOM
		});

	注意事项：

	- num 和 radius： 设定num后，就不需要设定radius，系统会计算出合理的半径大小。
	- resetControl 和 verifyControl 都是外部控制选项。其中前者如果绑定dom元素，则点击该元素则密码重置。如果不设定的话，用户可以调用reset()方法进行重置。后者不推荐设定，系统在成功设定密码之后会自动开始进入验证密码状态。
	- reminderEL: 推荐用户配置，否则得不到状态信息。
