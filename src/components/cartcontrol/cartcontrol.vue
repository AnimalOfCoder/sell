<template>
    <div class="cartcontrol">
        <transition name="move">
            <div class="cart-decrease icon-remove_circle_outline" v-show="food.count > 0" @click="decreaseCart">
            </div>
        </transition>
        
        <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click="addCart"></div>
    </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
// 引入事件传递中心
import EventHandler from '../../common/js/EventHandler';
export default {
    props: {
        food: {
            type: Object
        }
    },
    methods: {
        addCart(event) {
            // 浏览器原生点击事件无该属性，防止在PC端触发两次点击事件
            if (!event._constructed) {
                return;
            }
            if (!this.food.count) {
                // this.food.count = 1; vue给观测对象添加一个它不存在的属性并赋值，define property无法检测到这种变化
                /* 设置对象的属性。如果对象是响应式的，确保属性被创建后也是响应式的，同时触发视图更新。
                   这个方法主要用于避开 Vue 不能检测属性被添加的限制。
                */
                Vue.set(this.food, 'count', 1);
            } else {
                this.food.count++;
            }
            // 同级组件通讯
            EventHandler.$emit('add-cart', event.target);
        },
        decreaseCart(event) {
            // 浏览器原生点击事件无该属性，防止在PC端触发两次点击事件
            if (!event._constructed) {
                return;
            }
            if (this.food.count) {
                this.food.count--;
            }
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .cartcontrol
        font-size: 0
        .cart-decrease
            display inline-block
            padding: 6px
            line-height: 24px
            font-size: 24px
            color: rgb(0,160,210)
            transform: translate3d(0,0,0)
            &.move-enter-active,&.move-leave-active
                opacity: 1
                transition: all 0.4s linear
            &.move-enter,&.move-leave-to
                opacity: 0
                transform: translate3d(24px,0,0)
        .cart-count
            display inline-block
            vertical-align: top
            width: 12px
            padding-top: 6px
            line-height: 24px
            text-align: center
            font-size: 10px
            color: rgb(147,153,159)
        .cart-add   
            display inline-block
            padding: 6px 
            line-height: 24px
            font-size: 24px
            color: rgb(0,160,210)
</style>

