# 学习Vue中的数据双向绑定（一）

跟着百度前端学院中的[任务要求](http://ife.baidu.com/college/detail/id/8)从最基础部分的开始学习Vue的数据双向绑定。

阅读参考： [Vue早期源码学习系列](https://github.com/youngwind/blog)。

## 最基础的数据监听绑定

毫无疑问，想要监听数据的读取和更改，就是```Object.definePrototype```和```get```，```set```结合使用。

[任务一](http://ife.baidu.com/course/detail/id/15)：监听对象属性的变化。

    class Observer {
        constructor (value) {
            this.data = value;
            this.walk(value);
        }

        walk (obj) {
            for (let key of Object.keys(obj)) {
                let value = obj[key];
                this.convert(obj, key, value);
            }
        }

        convert (obj, key, value) {
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get () {
                    console.log(`你访问了${key}属性`);
                    return value;
                },
                set (newValue) {
                    console.log(`你将${key}属性从${value}改为了${newValue}`);
                    value = newValue;
                }
            })
        }
    }

    let app1 = new Observer({
        name: 'zzr',
        age: '24'
    });

    console.log(app1.data.age);	// 你访问了age属性 // 24
    app1.data.age = '25';		// 你将age属性从24改为了25
    console.log(app1.data.age);	// 你访问了age属性 // 25

从上面程序中Observer.prototype.walk 方法中可以知道，该方法无法针对对象中的多重嵌套，比如：

	// 第一种情况：传递给构造函数的Observer的对象的属性也是对象
	let app2 = new Observer({
		msg: {
			'a': 1,
			'b': 2
		}
	});
	console.log(app2.data.msg.a);	// 你访问了msg属性（没有提到a）

	// 第二种情况：将实例化对象的属性改成对象
	app1.data.name = {
		'firstName': 'Zhang',
		'lastName': 'zirui'
	};	// 你将name属性从zzr改为了[object Object]
	
	console.log(app1.data.name.firstName)	// 你访问了name属性 (没有提到firstName）

面对这两种情况就需要对对象进行深层绑定。

## 深层对象绑定

使用递归的方法对深层嵌套对象的属性进行逐个绑定，题目参考：[任务二](http://ife.baidu.com/course/detail/id/20)，[任务三](http://ife.baidu.com/course/detail/id/21)。

主要添加代码：

    if (isObject(value)) {	// isObject()的实现太简单，没有给出
        new Observer(value);
    }

分别针对前面所提出来的两种情况，将上述代码分别加入到 Observer 原型链中的 walk 和 convert 方法中：

	walk (obj) {
        for (let key of Object.keys(obj)) {
            let value = obj[key];
            if (isObject(value)) {
                new Observer(value);
            }
            this.convert(obj, key, value);
        }
    }

    convert (obj, key, value) {
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get () {
                console.log(`你访问了${key}属性`);
                return value;
            },
            set (newValue) {
                console.log(`你将${key}属性从${value}改为了${newValue}`);
                value = newValue;
                if (isObject(value)) {
                    new Observer(value);
                }
            }
        })
    }

## 实现事件监听

在[任务二](http://ife.baidu.com/course/detail/id/20)中还有一个要求，那就是能够嵌入观察者模式，即能够给监听的属性绑定事件，当属性变化的时候可以出发所绑定的事件。

面对这个要求，可以在Observer构造函数上直接添加自定义事件方法和触发事件方法。但是其实自定义事件这一类的方法其实和Observer构造函数是可以互相独立的，写在一起的话就有点高耦合了。所以就可以再定义个简单事件自定义和触发的构造函数，然后用Observer继承父类方法即可。
	
	 class Observer extends Event {
        constructor (value) {
            super();	// 添加
            this.data = value;
            this.walk(value);
        }

		walk () { 
			//不变 
		}		

		convert (obj, key, value) {
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get () {
                    console.log(`你访问了${key}属性`);
                    return value;
                },
                set: newValue => {
                    console.log(`你将${key}属性从${value}改为了${newValue}`);
                    value = newValue;
                    if (isObject(value)) {
                        new Observer(value);
                    }
                    this.$trigger(key, value);	// 添加
                }
            })
        }
    }

	 app1.$watch('age', function (age) {
         console.log(`触发监听事件，age变成${age}`);
    });
    app1.data.age = '18';	// 你将age属性从25改为了18 // 触发监听事件，age变成18

关于Event构造函数，不是本文的重点，在这里没有写出来，源码可以参看[这里]()。