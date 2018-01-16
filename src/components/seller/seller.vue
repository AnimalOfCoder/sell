<template>
    <div class="seller" ref="seller">
        <div class="seller-content">
            <div class="overview">
                <h1 class="title">{{seller.name}}</h1>
                <div class="desc border-1px">
                    <star :size="36" :score="seller.score"></star>
                    <span class="text">({{seller.ratingCount}})</span>
                    <span class="text">月售{{seller.sellCount}}单</span>
                </div>
                <ul class="remark">
                    <li class="block">
                        <h2>起送价</h2>
                        <div class="content">
                            <span class="stress">{{seller.minPrice}}元</span>
                        </div>
                    </li>
                    <li class="block">
                        <h2>商家配送</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryPrice}}元</span>
                        </div>
                    </li>
                    <li class="block">
                        <h2>平均配送时间</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryTime}}分钟</span>
                        </div>
                    </li>
                </ul>
                <div class="favorite" @click="toggleFavorite">
                    <span class="icon-favorite" :class="{'active':favorite}"></span>
                    <span class="text">{{favoriteText}}</span>
                </div>
            </div>
            <v-split></v-split>
            <div class="bulletin">
                <h1 class="title">公告</h1>
                <div class="content-wrapper border-1px">
                    <p class="content">{{seller.bulletin}}</p>
                </div>
                <ul v-if="seller.supports" class="supports">
                    <li class="support-item border-1px" v-for="item in seller.supports">
                        <span class="s-icon" :class="classMap[item.type]"></span>
                        <span class="text">{{item.description}}</span>
                    </li>
                </ul>
            </div>
            <v-split></v-split>
            <div class="pics">
                <h1 class="title">商家实景</h1>
                <div class="pic-wrapper" ref="picWrapper">
                    <ul class="pic-list" ref="picList">
                        <li class="pic-item" v-for="pic in seller.pics">
                            <img :src="pic" width="120" height="90">
                        </li>
                    </ul>
                </div>
            </div>
            <v-split></v-split>
            <div class="info">
                <h1 class="title border-1px">商家信息</h1>
                <ul>
                    <li class="info-item border-1px" v-for="info in seller.infos">{{info}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import star from '../star/star.vue';
    import split from '../split/split.vue';
    import BScroll from 'better-scroll';
    import {saveToLocal, loadFromLocal} from '../../common/js/store';
    export default {
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        },
        computed: {
            favoriteText() {
                return this.favorite ? '已收藏' : '收藏';
            }
        },
        // 监测变化
        watch: {
            // 监控props里面的seller数据变化,只有当页面刷新后，请求后端数据给seller赋值才会执行watch
            'seller' () {
                this._initScroll();
                this._initPicScroll();
            }
        },
        /*
            ready 替换
            使用新的 mounted 钩子函数替代。
            应该注意的是，使用 mounted 并不能保证钩子函数中的 this.$el 在 document 中。为此还应该引入 Vue.nextTick/vm.$nextTick
         */
        mounted: function () {
            // 整个DOM渲染完后执行
            this.$nextTick(function () {
                /*
                    滚动不了原因：
                    seller异步加载，导致计算DOM高度不正确。
                    DOM已经准备好,只会执行一次，此页面刷新后，就没有this.seller了
                */
                // console.log(this.seller);
                // 下面方法执行时期先于watch中seller执行时期，所以需要在方法体中调用refresh
                this._initScroll();
                this._initPicScroll();
            });
        },
        data() {
            return {
                favorite: (() => {
                    return loadFromLocal(this.seller.id, 'favorite', false);
                })()
            };
        },
        methods: {
            toggleFavorite(event) {
                if (!event._constructed) {
                    return;
                }
                this.favorite = !this.favorite;
                saveToLocal(this.seller.id, 'favorite', this.favorite);
            },
            _initScroll() { // 初始化
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.seller, {
                        click: true
                    });
                } else {
                    this.scroll.refresh();
                }
            },
            _initPicScroll() {
                if (this.seller.pics) {
                    let picWidth = 120;
                    let margin = 6;
                    let width = (picWidth + margin) * this.seller.pics.length - margin;
                    this.$refs.picList.style.width = width + 'px';
                    this.$nextTick(() => {
                        if (!this.picScroll) {
                            this.picScroll = new BScroll(this.$refs.picWrapper, {
                                click: true,
                                // 横向滚动
                                scrollX: true,
                                eventPassthrough: 'vertical'
                            });
                        } else {
                            this.picScroll.refresh();
                        }
                    });
                }
            }
        },
        props: {
            seller: {
                type: Object
            }
        },
        components: {
            star,
            'v-split': split
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin";
    .seller
        position: absolute
        top: 174px
        bottom: 0
        left: 0
        width: 100%
        overflow: hidden
        .overview
            padding: 18px
            position: relative
            .title
                margin-bottom: 8px
                line-height: 14px
                font-size: 14px
                color: rgb(7,17,27)
            .desc
                padding-bottom: 18px
                border-1px(rgba(7,17,27,0.1))
                font-size: 0
                .star
                    display: inline-block
                    margin-right: 8px
                    vertical-align: top
                .text
                    display: inline-block
                    vertical-align: top
                    line-height: 18px
                    margin-right: 12px  
                    font-size: 10px
                    color: rgb(77,85,93) 
            .remark
                display: flex
                padding-top: 18px
                .block
                    flex: 1
                    text-align: center
                    border-right: 1px solid rgba(7,17,27,0.1)
                    h2
                        margin-bottom: 4px
                        font-size: 10px
                        line-height: 10px
                        color: rgb(147,153,159)
                    .content
                        line-height: 24px
                        font-size: 10px
                        color: rgb(7,17,27)
                        .stress
                            font-size: 24px  
            .favorite
                position: absolute
                width: 50px
                right: 11px
                top: 18px
                text-align: center
                .icon-favorite
                    display: block
                    margin-bottom: 4px
                    line-height: 12px
                    font-size: 24px
                    color: #d4d6d9
                    &.active
                        color: rgb(240,20,20)
                .text
                    color: rgb(77,85,93)
                    line-height: 10px
                    font-size: 10px
        .bulletin
            padding: 18px 18px 0 18px
            .title
                margin-bottom: 8px
                line-height: 14px
                font-size: 14px
                color: rgb(7,17,27)
            .content-wrapper
                padding: 0 12px 16px 12px 
                border-1px(rgba(7,17,27,0.1))  
                .content
                    line-height: 24px
                    font-size: 12px
                    font-weight: 200
                    color: rgb(240,20,20)
            .supports
                .support-item
                    padding: 16px 12px
                    border-1px(rgba(7,17,27,0.1))
                    font-size: 0
                    &:last-child
                        border-none(after)        
                    .s-icon
                        display: inline-block
                        margin-right: 6px
                        vertical-align: top
                        width: 16px
                        height: 16px
                        background-size: 16px 16px
                        background-repeat: no-repeat
                        &.decrease
                            bg-image('decrease_4')
                        &.discount
                            bg-image('discount_4')
                        &.guarantee
                            bg-image('guarantee_4')
                        &.invoice
                            bg-image('invoice_4')
                        &.special
                            bg-image('special_4')
        .pics
            padding: 18px
            .title
                margin-bottom: 12px
                line-height: 14px
                font-size: 14px
                color: rgb(7,17,27)
            .pic-wrapper
                width: 100%
                white-space: nowrap
                overflow: hidden
                .pic-list
                    font-size: 0
                    .pic-item
                        display: inline-block
                        margin-right: 6px
                        width: 120px
                        height: 90px
                        &.last-child
                            margin: 0
        .info
            padding: 18px 18px 0 18px
            color: rgb(7,17,27)
            .title
                padding-bottom: 12px
                line-height: 14px
                font-size: 14px
                border-1px(rgba(7,17,27,0.1))
            .info-item
                padding: 16px 12px
                line-height: 16px
                border-1px(rgba(7,17,27,0.1))
                font-size: 12px
                &:last-child
                    border-none(after)

</style>

