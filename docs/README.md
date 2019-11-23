<p align="center"><image src="https://avatars1.githubusercontent.com/u/34465004?s=400&u=25c4b1279b2f092b368102edac8b7b54dc708d00&v=4" width="128"></p>

# @wya/keyboard
[![npm][npm-image]][npm-url] [![changelog][changelog-image]][changelog-url]

<!--  以下内容无视  -->
[changelog-image]: https://img.shields.io/badge/changelog-md-blue.svg
[changelog-url]: CHANGELOG.md

[npm-image]: https://img.shields.io/npm/v/@wya/keyboard.svg
[npm-url]: https://www.npmjs.com/package/@wya/keyboard

**@wya/keyboard** 是键盘事件管理

## 安装
``` shell
$ npm install @wya/keyboard --save
```

## 示例

```javascript
import Keyboard from '@wya/keyboard';
let keyboard = new Keyboard();

keyboard.on('a', (e) => {
	console.log(1);
});

keyboard.on('a + b', (e) => {
	console.log(1);
});

keyboard.on('b + a', (e) => {
	console.log(2);
});

keyboard.on('a + b > c', (e) => {
	console.log(3);
});
```

## 设置开发环境
克隆仓库之后，运行：

```shell
$ yarn install # 是的，推荐使用 yarn。 :)
```

```shell
# 监听并自动重新构建
$ npm run dev

# 单元测试
$ npm run test

# 构建所有发布文件
$ npm run lib
```

## 项目结构
+ **`assets`**: logo 文件。
+ **`config`**: 包含所有和构建过程相关的配置文件。
+ **`docs`**: 项目主页及文档。
+ **`lib`**: 包含用来发布的文件，执行 `npm run lib` 脚本后，这个目录不会被上传。
+ **`tests`**: 包含所有的测试，单元测试使用
+ **`src`**: 源代码目录。
+ **`demo`**: 在线运行的例子。
+ **`examples`**: 在线运行的源代码。

## API

---

### `on` 

`source.on(eventName: String, callback: Function)`

订阅事件

+ **eventName**: 绑定的事件名。
+ **callback**: 回调。

**示例**
```javascript
source.on('[event-name]', ({ name }) => {
	console.log(name, this);
});
```

---

### `once` 

`source.once(eventName: String, callback: Function)`

一次订阅

+ **eventName**: 绑定的事件名。
+ **callback**: 回调。

**示例**
```javascript
source.once('[event-name]', ({ name }) => {
	console.log(name, this);
});
```

---

### `off` 

`source.off(eventName: String, callback: Function)`

取消订阅

+ **eventName**: 绑定的事件名。
+ **callback**: 回调。

**示例**
```javascript
// 取消事件订阅, 指定回调
source.off('[event-name]', fn);

// 取消事件订阅
source.off('[event-name]');

// 取消订阅listener
source.off();
```

---

### `emit` 

`source.emit(eventName: String, params: Object)`

发布事件

+ **eventName**: 触发事件名。
+ **params**: 给回调的参数。

**示例**
```javascript
// 发布事件，第一个值事件，第二个值参数
source.emit('[event-name]', { name: 'wya-keyboard' }); 
```

---

### `listener` 

`source.on(callback: Function)`

监听

+ **params**: 监听器的回调。

**示例**
```javascript
// 订阅listener
source.on(({ name }) => {
	console.log(name, this);
});

// 取消订阅listener
source.off();
```



## 开源许可类型
MIT

## FAQ
Q: ？  
A: 。


