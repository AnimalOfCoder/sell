<template>
    <!-- 购物车组件 -->
    <div class="shopcart">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight': totalCount>0}">
                        <i class="icon-shopping_cart" :class="{'highlight': totalCount>0}"></i>
                    </div>
                    <div v-show="totalCount>0" class="num">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highlight': totalPrice>0}">￥{{totalPrice}}</div>
                <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <!-- 阻止单击事件继续传播 -->
            <div class="content-right" @click.stop="pay">
                <div class="pay" :class="payClass">{{payDesc}}</div>
            </div>
        </div>
        <div class="ball-container">
            <transition-group name="drop"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:after-enter="afterEnter"
            >
                <div v-for="(ball,index) in balls" v-show="ball.show" :key="index" class="ball">
                    <div class="inner inner-hook"></div>
                </div>
            </transition-group>
        </div>
        <transition name="fold">
            <div class="shopcart-list" v-show="listShow">
                <div class="list-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="empty">清空</span>
                </div>
                <div class="list-content" ref="listContent">
                    <ul>
                        <li class="food" v-for="food in selectFoods">
                            <span class="name">{{food.name}}</span>
                            <div class="price">
                                <span>￥{{food.price*food.count}}</span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <v-cartcontrol :food="food"></v-cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="list-mask" v-show="listShow" @click="hideList"></div>
        </transition>
    </div>
    
</template>
<script type="text/ecmascript-6">
// 引入事件传递中心
import EventHandler from '../../common/js/EventHandler';
import cartcontrol from '../cartcontrol/cartcontrol.vue';
import BScroll from 'better-scroll';
export default {
    props: {
        deliveryPrice: {
            type: Number,
            default: 0
        },
        minPrice: {
            type: Number,
            default: 0
        },
        // vue中，props中 type为数组或Object，default须是一个函数
        selectFoods: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            balls: [
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                }
            ],
            dropBalls: [],
            fold: true
        };
    },
    created() {
        // 监听事件中心传递的事件
        EventHandler.$on('add-cart', (target) => {
            this.drop(target);
        });
    },
    methods: {
        drop(target) {
            for (let i = 0; i < this.balls.length; i++) {
                let ball = this.balls[i];
                if (!ball.show) {
                    ball.show = true;
                    ball.el = target;
                    this.dropBalls.push(ball);
                    return;
                }
            }
        },
        /* 小球动画原理：
           外层div进行垂直移动，内层div进行水平移动
        */
        // 小球下落之前的运动函数钩子
        beforeEnter(el) {
            let count = this.balls.length;
            // console.log(el.getBoundingClientRect());
            while (count--) {
                let ball = this.balls[count];
                if (ball.show) {
                    let rect = ball.el.getBoundingClientRect();// 获取点击的按钮到视窗各方向的距离集合
                    let x = rect.left - 32;// 水平方向上小球的位置（距离视窗左边）
                    let y = -(window.innerHeight - rect.top - 22);
                    // 外层div
                    el.style.display = '';// 显示小球
                    el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                    el.style.transform = `translate3d(0,${y}px,0)`;
                    // 内层div
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                    inner.style.transform = `translate3d(${x}px,0,0)`;
                }
            }
        },
        enter(el) {
            /* eslint-disable no-unused-vars */
            // 触发浏览器重绘
            // let rf = el.offsetHeight;
            this.$nextTick(() => {
                el.style.webkitTransform = 'translate3d(0,0,0)';
                el.style.transform = 'translate3d(0,0,0)';
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = 'translate3d(0,0,0)';
                inner.style.transform = 'translate3d(0,0,0)';
            });
        },
        afterEnter(el) {
            let ball = this.dropBalls.shift();
            if (ball) {
                ball.show = false;
                el.style.display = 'none';
            }
        },
        toggleList() {
            if (this.totalCount) {
                this.fold = !this.fold;
            }
        },
        // 清空购物车
        empty() {
            this.selectFoods.forEach((food) => {
                food.count = 0;
            });
        },
        // 隐藏购物侧
        hideList() {
            this.fold = true;
        },
        // 结算-----待完善
        pay() {
            if (this.totalPrice >= this.minPrice) {
                window.alert(`支付${this.totalPrice}元`);
            }
        }
    },
    components: {
        'v-cartcontrol': cartcontrol
    },
    computed: {
        // 总价格计算
        totalPrice() {
            let total = 0;
            this.selectFoods.forEach(food => {
                total += food.price * food.count;
            });
            return total;
        },
        // 总数量计算
        totalCount() {
            let count = 0;
            this.selectFoods.forEach(food => {
                count += food.count;
            });
            return count;
        },
        // 差多少配送计算
        payDesc() {
            if (this.totalPrice === 0) {
                return `￥${this.minPrice}元起送`;
            } else if (this.totalPrice < this.minPrice) {
                let diff = this.minPrice - this.totalPrice;
                return `还差￥${diff}元起送`;
            } else {
                return '去结算';
            }
        },
        // 支付样式
        payClass() {
            if (this.totalPrice >= this.minPrice) {
                return 'enough';
            } else {
                return 'not-enough';
            }
        },
        // 购物车详情展开计算
        listShow() {
            if (!this.totalCount) {
                this.fold = true;
                return false;
            }
            let show = !this.fold;
            // 在展开时，加上滚动组件
            if (show) {
                this.$nextTick(() => {
                    // scroll实例不存在的时候，创建实例
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.listContent, {
                            click: true
                        });
                    } else {
                        /*
                            refresh()
                            参数：无
                            返回值：无
                            作用：重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
                        */
                        this.scroll.refresh();
                    }
                });
            }
            return show;
        }
    }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin";
    .shopcart
        position: fixed
        left: 0
        bottom: 0
        z-index: 50
        width: 100%
        height: 48px
        .content
            display: flex
            background: #141d27
            color: rgba(255,255,255,0.4)
            font-size: 0
            .content-left
                flex: 1
                .logo-wrapper
                    display: inline-block
                    position: relative
                    top: -10px
                    margin: 0 12px
                    padding: 6px
                    width: 56px
                    height: 56px
                    box-sizing: border-box
                    vertical-align: top
                    border-radius: 50%
                    background: #141d27
                    .logo
                        width: 100%
                        height: 100%
                        border-radius: 50%
                        background: #2b343c
                        text-align: center
                        &.highlight
                            background: rgb(0,160,220)
                        .icon-shopping_cart
                            line-height: 44px    
                            font-size: 24px
                            color: #80858a
                            &.highlight
                                color: #fff
                    .num
                        position: absolute
                        top: 0
                        right: 0
                        width: 24px
                        height: 16px
                        line-height: 16px
                        border-radius: 16px
                        font-size: 9px
                        font-weight: 700
                        color: rgb(255,255,255)
                        background: rgb(240,20,20)
                        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
                        text-align: center           
                .price
                    display: inline-block
                    vertical-align: top
                    margin-top: 12px
                    line-height: 24px
                    font-size: 16px
                    font-weight: 700
                    box-sizing: border-box
                    padding-right: 12px
                    border-right: 1px solid rgba(255,255,255,0.1)
                    &.highlight
                        color: rgb(255,255,255)
                .desc 
                    display: inline-block     
                    vertical-align: top
                    margin: 12px 0 0 12px 
                    line-height: 24px
                    font-size: 10px
            .content-right
                flex: 0 0 105px
                width: 105px
                .pay
                    line-height: 48px
                    text-align: center
                    height: 48px
                    font-size: 12px
                    font-weight: 700
                    background: #2b333b
                    &.not-enough
                        background: #2b333b
                    &.enough
                        background: #00b43c
                        color: #fff
        .ball-container
            .ball
                position: fixed
                left: 32px
                bottom: 22px
                z-index: 200
                &.drop-enter-active
                    transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.42)
                    .inner
                        width: 16px
                        height: 16px
                        border-radius: 50%
                        background: rgb(0,160,200)
                        transition: all 0.4s linear
        .shopcart-list
            position: absolute
            top: 0
            left: 0
            z-index: -1
            width: 100%
            transform: translate3d(0,-100%,0)
            &.fold-enter-active,&.fold-leave-active
                transition: all 0.5s
            &.fold-enter,&.fold-leave-to
                transform: translate3d(0,0,0)
            .list-header
                height: 40px
                line-height: 40px
                padding: 0 18px 
                background: #f3f5f7
                border-bottom: 1px solid rgba(7,17,27,0.1)
                .title
                    float: left
                    font-size: 14px
                    font-weight: 200
                    color: rgb(7,17,27)
                .empty
                    float: right 
                    font-size: 12px
                    font-weight: 200
                    color: rgb(0,160,220)
            .list-content
                padding: 0 18px
                max-height: 217px
                overflow: hidden
                background: #fff
                .food
                    position: relative
                    padding: 12px 0
                    box-sizing: border-box
                    border-1px(rgba(7,17,27,0.1))
                    .name
                        line-height: 24px
                        font-size: 14px
                        color: rgb(7,17,27)
                    .price
                        position: absolute
                        right: 90px
                        bottom: 12px
                        line-height: 24px
                        font-weight: 700
                        font-size: 14px
                        color: rgb(240,20,20)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 6px
        .list-mask
            position: fixed
            top: 0
            left: 0
            width: 100%
            height: 100%
            z-index: -2
            backdrop-filter: blur(10px)
            background: rgba(7,17,27,0.6)
            &.fade-enter-active,&.fade-leave-active
                transition: all 0.5s 
                opacity: 1
            &.fade-enter,&.fade-leave-to
                opacity: 0

</style>

