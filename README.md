# Background Image Preload

## 用途
让背景图片延迟下载，缓减加载压力。

## 使用方法
```js
$('.have-bg').bgLazyload();
```

## Bugfix
桌面浏览器background-image输出为url("http://domain.com/some.jpg"),而移动端浏览器桌面输出为url(http://domain.com/some.jpg)，少了双引号
