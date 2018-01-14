<template>
    <transition name="foodDetail">
        <div v-show="showFlag" class="food" ref="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image">
                    <div class="back" @click="hide">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="content">
                    <div class="title">{{food.name}}</div>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}</span>
                    </div>
                    <div class="price">
                        <span class="new-price">￥{{food.price}}</span><span class="old-price" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                        <v-cartcontrol :food="food"></v-cartcontrol>
                    </div>
                    <div class="buy" v-show="!food.count || food===0" @click.stop="addFirst">加入购物车</div>
                </div>
                <v-split v-show="food.info"></v-split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品介绍</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <v-split></v-split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <v-ratingselect @sel-ratings="selRatings" @tog-content="togContent" :ratings="food.ratings" :desc="desc" :select-type="selectType" :only-content="onlyContent"></v-ratingselect>
                    <div class="rating-warpper">
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="avatar" width="12" height="12" :src="rating.avatar">
                                </div>
                                <div class="time">{{rating.rateTime | formatDate()}}</div>
                                <p class="text">
                                    <span class="icon" :class="{'icon-thumb_up': rating.rateType===0,'icon-thumb_down': rating.rateType===1}"></span>
                                    <span>{{rating.text}}</span>
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
    
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import cartcontrol from '../cartcontrol/cartcontrol.vue';
    import Vue from 'vue';
    import split from '../split/split.vue';
    import ratingselect from '../ratingselect/ratingselect.vue';
    // 引入事件传递中心
    import EventHandler from '../../common/js/EventHandler';
    // 引入日期格式化方法
    import {formatDate} from '../../common/js/date';
    const ALL = 2;
    export default {
       props: {
           food: {
               type: Object
           }
       },
       data() {
           return {
               showFlag: false,
               selectType: ALL,
               onlyContent: true,
               desc: {
                   all: '全部',
                   positive: '推荐',
                   negative: '吐槽'
               }
           };
       },
       methods: {
           show() {
               this.showFlag = true;
               // food组件被多个商品使用，传入不同商品时，保持初始化状态
               this.selectType = ALL;
               this.onlyContent = true;
               this.$nextTick(() => {
                   if (!this.BScroll) {
                       this.scroll = new BScroll(this.$refs.food, {
                           click: true
                       });
                   } else {
                       this.scroll.refresh();
                   }
               });
           },
           hide() {
               this.showFlag = false;
           },
           // 添加第一个商品
           addFirst(event) {
                // 浏览器原生点击事件无该属性，防止在PC端触发两次点击事件
                if (!event._constructed) {
                    return;
                }
                Vue.set(this.food, 'count', 1);
                // 同级组件通讯
                EventHandler.$emit('add-cart', event.target);
           },
           // 需要展示的评价
           needShow(type, text) {
               // 要显示内容，却无内容时
               if (this.onlyContent && !text) {
                   return false;
               }
               // 选择类型为全选
               if (this.selectType === ALL) {
                   return true;
               } else {
                   // 否则选择类型要与评价类型一致才能被展示
                   return type === this.selectType;
               }
           },
           // 监听ratingselect组件的selRatings事件触发时的回调方法
           selRatings(type) {
               this.selectType = type;
               this.$nextTick(() => {
                   this.scroll.refresh();
               });
           },
           // 监听ratingselect组件的togContent事件触发时的回调方法
           togContent(content) {
               this.onlyContent = content;
               this.$nextTick(() => {
                   this.scroll.refresh();
               });
           }

       },
       // 过滤器
       filters: {
           formatDate(time) {
               let date = new Date(time);
               return formatDate(date, 'yyyy-MM-dd hh:mm');
           }
       },
       components: {
           'v-cartcontrol': cartcontrol,
           'v-split': split,
           'v-ratingselect': ratingselect
       }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin";
    .food
        position: fixed
        top: 0
        left: 0
        bottom: 48px
        z-index: 30
        width: 100%
        background: #fff
        &.foodDetail-enter-active,&.foodDetail-leave-active
            transition: all 0.5s
            transform: translate3d(0,0,0)
        &.foodDetail-enter,&.foodDetail-leave-to
            transform: translate3d(100%,0,0)
        .image-header
            position: relative
            width: 100%
            height: 0
            // 保证padding值和宽度一样，盒子变成宽高相同的容器
            padding-top: 100%
            img
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
            .back
                position: absolute
                top: 10px
                left: 0
                .icon-arrow_lift
                    display: block
                    padding: 10px
                    font-size: 80
                    color: #fff 


        .content
            position: relative
            padding: 18px
            .title
                line-height: 14px
                margin-bottom: 8px
                font-size: 14px
                font-weight: 700
                color: rgb(7,17,27)
            .detail
                margin-bottom: 18px
                line-height: 10px
                font-size: 0
                color: rgb(147,153,159) 
                height: 10px               
                .sell-count
                    font-size: 10px
                    margin-right: 12px
                .rating
                    font-size: 10px
            .price  
                line-height: 24px
                font-weight: 700
                .new-price
                    margin-right: 8px
                    font-size: 14px
                    color: rgb(240,20,20)
                .old-price
                    text-decoration: line-through
                    font-weight: normal
                    font-size: 10px
                    color: rgb(147,153,159)
            .cartcontrol-wrapper
                position: absolute
                right: 12px
                bottom: 12px
            .buy
                position: absolute
                right: 18px
                bottom: 18px
                z-index: 10px
                height: 24px
                line-height: 24px
                padding: 0 12px
                box-sizing: border-box
                font-size: 10px
                border-radius: 12px
                color: #fff
                background: rgb(0,160,220)
        .info
            padding: 18px
            .title
                line-height: 14px
                margin-bottom: 6px
                font-size: 14px
                color: rgb(7,17,27)
            .text
                line-height: 24px
                padding: 0 8px
                font-size: 12px
                color: rgb(77,85,93)  
        .rating
            padding-top: 18px
            .title
                line-height: 14px
                margin-left: 18px
                font-size: 14px
                color: rgb(7,17,27)
            .rating-warpper
                padding: 0 18px
                .rating-item
                    position: relative
                    padding: 16px 0
                    border-1px(rgba(7,17,27,0.1))
                    .user
                        position: absolute
                        right: 0
                        top: 16px
                        line-height: 12px
                        font-size: 0
                        .name
                            display: inline-block
                            margin-right: 6px
                            vertical-align: top
                            font-size: 10px
                            color: rgb(147,153,159)
                        .avatar
                            border-radius: 50% 
                    .time
                        margin-bottom: 6px
                        line-height: 16px
                        font-size: 10px
                        color: rgb(147,153,159)
                    .text
                        font-size: 12px
                        line-height: 16px
                        color: rgb(7,17,27)
                        margin-top: 6px
                        .icon
                            margin-right: 4px
                            &.icon-thumb_up
                                color: rgb(0,160,220)
                            &.icon-thumb_down
                                color: rgb(147,153,159)
                .no-rating
                    padding: 16px 0
                    font-size: 12px
                    color: rgb(147,153,159)                

</style>

