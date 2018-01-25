# my-item

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 自己的笔记
### 商品管理模块
#### 商品分类
- 新模块开发流程
  + 创建目录 product
  + 创建文件 Category.vue
  + 写Category.vue文件模板(template script style)
  + 创建路由
  + 搭建UI层面的模板
  + 实现具体逻辑
    * 初始化列表数据功能
      1. 需求:当进入页面时候,显示表格数据
      2. 实现: 根据后台接口文档,调用接口,获取数据,将数据渲染到页面
- 使用自己创建的子组件的方法
  + 引入组件 import 组件名 from 相对地址
  + 与methods平级位置,components: { 组件名 }
  + 假如组件名是TreeGrid 则默认组件标签为tree-grid
  + 可以给子组件重命名, 例如: 'abc': TreeGrid