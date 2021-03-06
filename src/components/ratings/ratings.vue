<template>
    <div class="ratings" ref="ratingsContent">
        <div class="ratings-content">
            <div class="overview">
                <div class="overview-left">
                    <h1 class="score">{{seller.score}}</h1>
                    <div class="title">综合评分</div>
                    <div class="rank">高于周边商家{{seller.rankRate}}</div>
                </div>
                <div class="overview-right">
                    <div class="score-wrapper">
                        <span class="title">服务态度</span>
                        <star :size="36" :score="seller.serviceScore"></star>
                        <span class="score">{{seller.serviceScore}}</span>
                    </div>
                    <div class="score-wrapper">
                        <span class="title">商品评分</span>
                        <star :size="36" :score="seller.foodScore"></star>
                        <span class="score">{{seller.foodScore}}</span>
                    </div>
                    <div class="delivery-wrapper">
                        <span class="title">送达时间</span>
                        <span class="deliveryTime">{{seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <v-split></v-split>
            <v-ratingselect @sel-ratings="selRatings" @tog-content="togContent" :ratings="ratings" :select-type="selectType" :desc="desc" :only-content="onlyContent"></v-ratingselect>
            <div class="rating-wrapper">
                <ul>
                    <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in ratings" :key="index" class="rating-item">
                        <div class="avatar">
                            <img width="28" height="28" :src="rating.avatar">
                        </div>
                        <div class="content">
                            <h1 class="name">{{rating.username}}</h1>
                            <div class="star-wrapper">
                                <star :size="24" :score="rating.score"></star>
                                <span class="deliveryTime" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                            </div>
                            <p class="text">{{rating.text}}</p>
                            <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                                <span class="icon-thumb_up"></span>
                                <span class="text" v-for="item in rating.recommend">{{item}}</span>
                            </div>
                            <div class="time">{{rating.rateTime | formatDate()}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import star from '../star/star.vue';
    import split from '../split/split.vue';
    import ratingselect from '../ratingselect/ratingselect.vue';
    // 引入日期格式化方法
    import {formatDate} from '../../common/js/date';
    import BScroll from 'better-scroll';
    const ALL = 2;
    const ERR_OK = 0;
    export default {
        props: {
            seller: {
                type: Object
            }
        },
        data() {
            return {
               ratings: [],
               selectType: ALL,
               onlyContent: true,
               desc: {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                }
            };
        },
        created() {
            // GET
            this.$http.get('/api/ratings').then(response => {
                response = response.body;
                if (response.errno === ERR_OK) {
                    this.ratings = response.data;
                    this.$nextTick(() => {
                        this._initScroll();
                    });
                }
            }, response => {
                // error callback
            });
        },
        methods: {
            _initScroll() { // 初始化
                this.scroll = new BScroll(this.$refs.ratingsContent, {
                    click: true
                });
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
            star,
            'v-split': split,
            'v-ratingselect': ratingselect
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin";
    .ratings
        position: absolute
        top: 174px
        bottom: 0
        left: 0
        width: 100%
        overflow: hidden
        .overview
            display: flex
            padding: 18px 0
            .overview-left
                padding: 6px 0
                flex: 0 0 137px
                width: 137px
                text-align: center
                // 适配Iphone5
                @media only screen and (max-width: 320px)
                    flex: 0 0 120px
                    width: 120px
                .score
                    margin-bottom: 6px
                    line-height: 28px
                    font-size: 24px
                    color: rgb(255,153,0)
                .title
                    margin-bottom: 8px
                    line-height: 12px
                    font-size: 12px
                    color: rgb(7,17,27)
                .rank  
                    font-size: 10px
                    color: rgb(147,153,159)      
            .overview-right
                flex: 1
                padding: 6px 0 6px 24px
                @media only screen and (max-width: 320px)
                    padding-left: 6px
                .score-wrapper
                    line-height: 18px
                    margin-bottom: 8px
                    font-size: 0
                    .title
                        display: inline-block 
                        vertical-align: top
                        font-size: 12px
                        color: rgb(7,17,27)
                    .star
                        display: inline-block    
                        margin: 0 12px
                        vertical-align: top
                    .score
                        display: inline-block 
                        vertical-align: top
                        font-size: 12px
                        color: rgb(255,153,0) 
                .delivery-wrapper
                    font-size: 0
                    .title
                        font-size: 12px
                        color: rgb(7,17,27)
                    .deliveryTime
                        font-size: 12px
                        color: rgb(147,153,159) 
                        margin: 0 12px
        .rating-wrapper
            padding: 0 18px
            .rating-item
                display: flex
                padding: 18px 0
                border-1px(rgba(7,17,27,0.1))
                .avatar
                    flex: 0 0 28px
                    width: 28px
                    margin-right: 12px
                    img
                        border-radius: 50%
                .content
                    position: relative
                    flex: 1
                    .name
                        margin-bottom: 4px
                        line-height: 12px
                        font-size: 10px
                        color: rgb(7,17,27)
                    .star-wrapper
                        margin-bottom: 6px
                        font-size: 0
                        .star
                            display: inline-block
                            margin-right: 6px
                            vertical-align: top
                        .deliveryTime
                            display:inline-block
                            vertical-align:top
                            font-size:10px
                            font-weight:200
                            line-height:12px
                            color:rgb(147,153,159)
                    .text
                        margin-bottom: 8px
                        line-height: 18px 
                        color: rgb(7,17,27)
                        font-size: 12px      
                    .recommend
                        line-height: 16px
                        font-size: 0
                        .icon-thumb_up, .text
                            display: inline-block   
                            margin: 0 8px 4px 0
                            font-size: 9px 
                        .icon-thumb_up
                            color: rgb(0,160,220)
                        .text
                            display:inline-block
                            padding:0 6px
                            border-radius: 1px
                            border:1px solid rgba(7,17,27,0.1)
                            background:#fff
                            text-align:center
                            color:rgb(147,153,159) 
                    .time
                        position: absolute
                        line-height: 12px
                        top: 0
                        right: 0
                        font-size: 10px
                        font-weight: 200
                        color:rgb(147,153,159)    

</style>

