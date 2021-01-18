## umi-plugin-autozip

一个 umi 插件, 可以在 build 完毕之后, 自动打包所有资源

使用方法:

1. 下载
```
yarn add -D umi-plugin-autozip
```

2. 添加插件参数(在 .umirc.ts 中):
```
  zipParams: {
    buildDir: `${__dirname}/dist/`,   // build 文件的路径
    open: true, // 是否启用插件, 默认关闭
    name: 'XXX测试版本', // 压缩包名称
    showTime: true, // 包名是否添加时间戳
  },
```

3. 在 build 时会自动使用此插件
