## 代码使用

	npm install
	npm run dev

# 搞清楚文件上传

问一个同学面经，其中有一个问题是如何上传图片。听到这个问题，当时我脑子里面想到了FormData，可是具体怎么去写，好像不知道，因为从来没去写过。所以就有了这篇笔记。

## ```<input type="file">```

图片也是文件，所以就可以利用 ```<input type="file">```标签来上传图片。在[w3school文档](http://www.w3school.com.cn/jsref/dom_obj_fileupload.asp)中这么解释：  在HTML文档中```<input type="file">```标签每出现一次，一个FileUpload对象就会被创建。

	// html
	<input type="file" class="file">
	
	// js
	let filesDom = document.querySelector('.file');
	console.log(fileDom.files);	// 返回类数组对象，对象里面包含input标签所选文件
	let file = fileDom.files[0];
	// file对象上有三个属性 name, size, type 

此时，fileDom.files数组中只包含一个文件，因为```<input type="file">```标签只能选择一个文件，如果想选择多个，则可以加上multiple属性：

	<input type="file" class="file" multiple>

## 文件上传

### 常规方法

常规，那就是表单上传了：

    <form action="/upload_0" class="form_0" enctype="multipart/form-data" method="post">
        <input type="file" class="file">
        <button type="submit" class="btn">上传</button>
    </form>

这个办法现在很少使用了，因为会发生页面跳转呀，用户体验得多差，现在都是无刷新上传。
	
### 借用隐藏的```iframe```

还是正常表单上传的逻辑，只是在```form```标签里面添加```target```属性。这个```target```属性和```a```标签的用法是一样的。这里我们让```target="framename"```，这样form表单提交后就会在```iframe```中打开，而```iframe```标签被我们给隐藏了，所以看起来就像是无刷新上传了。

     <form action="/upload_1" class="form_1" enctype="multipart/form-data" method="post" target="hide">
        <input type="file" class="file1" name="file1">
        <button type="submit" class="btn1">使用隐藏iframe实现上传</button>
    </form>
    <iframe name="hide" frameborder="0" style="display: none"></iframe>

但是利用iframe有一些问题，就是我们无法得到上传的进度信息，如果不做任何处理的话，好像什么都没有发生，用户会不知道发生了什么（我是谁...我在哪里...我做了什么...）。

所以我们必须在后台做出一个处理，那就是上传成功后，iframe得调用top框架中已写好的方法，来告诉用户上传成功。

但是我们也仅仅能得到最后成功的消息，至于过程是无法反馈用户的。所以就又有了新的方法。


### ```XMLHttpRequest Level 2```异步上传
```XMLHttpRequest Level 2```具有完善的进度事件，且支持FormData数据类型，使得上传文件可以不通过表单元素，而是通过new一个
FormData数据类型即可。

	// html
	<div class="form_2">
        <input type="file" class="file2" name="file2" multiple>
        <button type="submit" class="btn2">使用xhr2实现上传</button>
    </div>

	// js
	let formData = new FormData(),
        fileDom = document.querySelector('.file2');
    fileDom.files[Symbol.iterator] = Array.prototype;[Symbol.iterator];
    for (let file of fileDom.files) {
        formData.append(`files2`, file, file.name);
    }
	
通过以上代码，就可以将所选的文件数据全部加入formData中。

其次```XMLHttpRequest Level 2```支持```loadstart, progress, err, load, abort, loadend```事件，这些事件针对的是接收信息的进度。而上传信息的进度在相应upload属性中，这六个事件在upload属性中也均存在。

> 在这里值得注意的是编写上传进度条事件的时候，一定是```xhr.upload.onprogress = function () {}```;


## 其他

### 进行图片预览

如果上传的文件是图片的话，往往就会有预览功能，传统的方法时后台返回src地址给图片，而更方便的方法就是使用```FileReader API```。

	// html
	<div class="form_3">
         <input type="file" class="file3" name="file3" accept="image/*">
    </div>


	// js
	let file3 = document.querySelector('.file3');
	file3.onchange = function () {
		if (file3.files[0] !== undefined && typeof FileReader !== 'undefined') {
			preview(file3.files[0]);
		}
	};

	function preview (file) {
		const pattern = /image\/[png|jpeg|gif]/;
		if (pattern.test(file.type)) {
			let fileRead = new FileReader();
			fileRead.onload = function (event) {
				let img = new Image();
				img.src = event.target.result;
				img.className = 'imgStyle' 	// 自己设置样式；
				document.body.appendChild(img);
			}
			fileRead.readAsDataURL(file);
		}
	}

关于详细的```FileReader API```可参考[该链接](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader#readAsDataURL())。


### 文件拖拽

除了通过触发```<input type="file">```以外，现在很多上传效果还支持拖拽上传。

拖拽元素时，依次触发 ```dragstart, drag, dragend``` 事件；

拖拽元素放到目标位置时，目标位置依次触发 ```dragenter, dragoverm, drop``` 事件

	// html
	<div class="form_3">
		<span class="imgBox"></span>
    </div>	

	// js
	let imgBox = document.querySelector('.imgBox');

	imgBox.addEventListener('dragenter', dragEvent, false);
	imgBox.addEventListener('dragover', dragEvent, false);
	imgBox.addEventListener('drop', dropEvent, false);

	function dragEvent (e) {
		e.preventDefault();		// 某些元素默认不允许放置，阻止默认操作，使得其可放置
		e.stopPropagation();
		imgBox.className = 'XXX' //修改样式，表明正在往里拖拽
	}

	function dropEvent (e) {
		e.preventDefault();		// 阻止页面跳转
		e.stopPropagation();
		let file = e.dataTransfer.files[0];
		preivew(file) 
	}
