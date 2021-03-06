import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from './components/goods/goods.vue';
import ratings from './components/ratings/ratings.vue';
import seller from './components/seller/seller.vue';
import './common/stylus/index.styl';
// 全局注册
Vue.use(VueRouter);
Vue.use(VueResource);
/* eslint-disable */
//实例化VueRouter
var router = new VueRouter({
  routes: [
    { path: '/goods', component: goods },
    { path: '/ratings', component: ratings },
    { path: '/seller', component: seller }
  ],
  //精确激活<router-link>默认class
  linkActiveClass: 'active1',
  linkExactActiveClass: 'active2'
});
/* render函数是渲染一个视图，然后提供给el挂载，如果没有render那页面什么都不会出来
vue.2.0的渲染过程：
1.首先需要了解这是 es 6 的语法，表示 Vue 实例选项对象的 render 方法作为一个函数，接受传入的参数 h 函数，返回 h(App) 的函数调用结果。
2.其次，Vue 在创建 Vue 实例时，通过调用 render 方法来渲染实例的 DOM 树。
3.最后，Vue 在调用 render 方法时，会传入一个 createElement 函数作为参数，也就是这里的 h 的实参是 createElement 函数，
然后 createElement 会以 APP 为参数进行调用，关于 createElement 函数的参数说明参见：Element-Arguments

结合一下官方文档的代码便可以很清晰的了解Vue2.0 render:h => h(App)的渲染过程。
[官方文档]：
 render: function (createElement) {
     return createElement(
       'h' + this.level,   // tag name 标签名称
       this.$slots.default // 子组件中的阵列
     )
   }
*/
let app = new Vue({
  router: router,
  //components: { App }  vue1.0的写法
  render: h => h(App),
}).$mount('#app');
// 打开的默认路径
router.push('/goods');