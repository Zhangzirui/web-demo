## jQuery 全屏滚动插件(PC端)

> 慕课网奇舞团课程之一

页面展示: [点击](https://zhangzirui.github.io/web-demo/js/jquery全屏滚动插件/demo.html)

### 学习总结

1. jquery 插件的主要编写模式

	- $.PluginName = function() {};
	  
		直接添加到jQuery命名空间下，封装全局函数插件

	- $.fn.PluginName = function() {};

		添加到原型链上，封装对象方法插件

	本插件采用第二种方法，具体架构为下：

		;(function($) {
			var PageSwitch = (function() {
				function PageSwitch(element, options) {
					this.el = element;
					this.settings = $.extend(true, $.fn.PageSwitch.default, options);
					this.init();
				}

				PageSwitch.prototype.init = function() {
					// coding...
				};

				return PageSwitch;
			})();

			$.fn.PageSwitch = function(options) {
				return this.each(function() {
					var self = $(this),
						instance = self.data("pageSwitch");
					if (!instance) {
						instance = new PageSwitch(self, options);
						self.data("pageSwitch", instance);
					}

					if ($.type(options) == "string") {
						return instance[options]();
					}
				})
			};

			$.fn.PageSwitch.default = {
				// options
			};
		})(jQuery);

2. 事件复习

	- 滚轮事件 

			$(window).on("mousewheel DOMMouseScroll", function(e) {
				e.preventDefault();
				var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
			})
			// 其中火狐支持DOMMouseScroll事件和对应的detail属性，滚轮向上滚为-3，下滚+3；
			// 其余浏览器支持mousewheel事件和对应的wheelDelta属性，滚轮向上滚是+120，下滚是-120。(opera9.5之前版本方向相反)


### 插件说明

1. 属性配置

		$.fn.PageSwitch.default = {
	        selector: {		// 支持更改绑定class
	            sections: ".sections",
	            section: ".section",
	            page: ".page",
	            active: ".active"
	        },
	        index: 0,		// 页面初始展现的界面索引
	        direction: "vertical",	//竖向滚动还是横向滚动
	        loop: false,	// 是否支持循环滚动
	        pagination: true,	// 是否支持分页
	        keyboard: true,		// 是否支持键盘事件
	        easing: "ease",		// 滚动速度样式
	        duration: 500,		// 滚动时间
	        callback: null		// 可自定义滚动结束后回调事件
	    }

2. 页面结构

		<div id="container">
			<div class="sections">
				<div class="section"></div>
			</div>
			<div class="sections">
				<div class="section"></div>
			</div>
			<div class="sections">
				<div class="section"></div>
			</div>
		</div>

3. 初始化方法

		$("#container").PageSwitch({
	            direction: "horizontal"
	        });
