<template>
  <div>
   <v-header :seller="seller"></v-header>
   <div class="tab border-1px border-1px-top">
    <div class="tab-item">
    <!-- 使用 router-link 组件来导航. -->
    <!-- 通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/goods" v-bind:class="{}">商品</router-link>
    </div>
    <div class="tab-item">
      <router-link to="/ratings">评论</router-link>
    </div>
    <div class="tab-item">
      <router-link to="/seller">商家</router-link>
    </div>
   </div>
   <!-- 路由出口 -->
   <!-- 路由匹配到的组件将渲染在这里 -->
   <router-view :seller="seller"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from './components/header/header.vue';
  const ERR_OK = 0;
  export default {
    data() {
      return {
        seller: {}
      };
    },
    /*
      类型：Function
      详细：在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，
          属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。
    **/
    created() {
      // GET /someUrl
      this.$http.get('/api/seller').then(response => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.seller = response.data;
          console.log(this.seller);
        }
      }, response => {
        // error callback
      });
    },
    components: {
      'v-header': header
    }
  }/* eslint-disable */
</script>

<<style lang="stylus" rel="stylesheet/stylus">
    @import "./common/stylus/mixin.styl"
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7, 17, 27, 0.1))
      border-1px-top(rgba(7, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align: center
        & > a
          display: block
          font-size: 14px
          color: rgb(77, 85, 93)
        &.active1,.active2
          color: rgb(240, 20, 20)         
</style>