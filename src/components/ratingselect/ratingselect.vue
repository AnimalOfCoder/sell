<template>
    <div class="ratingselect">
        <div class="rating-type border-1px">
            <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
            <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
            <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
        </div>
        <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;
    export default {
        props: { // 由父级组件传入的数据
            ratings: {
                type: Array,
                default() {
                    return [];
                }
            },
            // selectType: {
            //     type: Number,
            //     default: ALL
            // },
            // onlyContent: {
            //     type: Boolean,
            //     default: false
            // },
            desc: {
                type: Object,
                default() {
                    return {
                        all: '全部',
                        positive: '满意',
                        negative: '不满意'
                    };
                }
            }
        },
        data() { // 自身定义的数据
            return {
                selectType: { // 选择type
                    type: Number,
                    default: ALL
                },
                onlyContent: {
                    type: Boolean,
                    default: false
                }
            };
        },
        methods: {
            select(type, event) {
                if (!event._constructed) {
                    return;
                }
                this.selectType = type;
                // 自定义事件，向父级传输数据
                this.$emit('sel-ratings', this.selectType);
            },
            toggleContent(event) {
                if (!event._constructed) {
                    return;
                }
                this.onlyContent = !this.onlyContent;
                // 自定义事件，向父级传输数据
                this.$emit('tog-content', this.onlyContent);
            }
        },
        computed: {
            positives() {
                /*
                    js中Array的方法
                    filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
                    注意： filter() 不会对空数组进行检测。
                          filter() 不会改变原始数组。
                */
                return this.ratings.filter((rating) => {
                    return rating.rateType === POSITIVE;
                });
            },
            negatives() {
                /*
                    js中Array的方法
                    filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
                    注意： filter() 不会对空数组进行检测。
                          filter() 不会改变原始数组。
                */
                return this.ratings.filter((rating) => {
                    return rating.rateType === NEGATIVE;
                });
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin";
    .ratingselect
        .rating-type
            padding: 18px 0
            margin: 0 18px
            border-1px(rgba(7,17,27,0.1))
            font-size: 0
            .block
                display: inline-block
                padding: 8px 12px
                margin-right: 8px
                border-radius: 1px
                color: rgb(77,85,93)
                font-size: 12px
                line-height: 16px
                &.active
                    color: #fff
                .count
                    margin-left: 2px
                    font-size: 8px
                &.positive
                    background: rgba(0,160,220,0.2)
                    &.active
                        background: rgb(0,160,220)
                &.negative
                    background: rgba(77,85,93,0.2) 
                    &.active
                        background: rgb(77,85,93)   
        .switch
            padding: 12px 18px
            line-height: 21px
            border-bottom: 1px solid rgba(7,17,27,0.1)         
            color: rgb(147,153,159)
            font-size: 0
            &.on
                .icon-check_circle
                    color: #00c850
            .icon-check_circle
                display: inline-block
                vertical-align: top
                margin-right: 4px
                font-size: 24px
            .text
                font-size: 12px
                display: inline-block
                vertical-align: top

</style>

