<<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <!-- 由于异步请求，seller.avatar一开始并不存在，所以用:src -->
                <img width="64" height="64" :src="seller.avatar">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div v-if="seller.supports" class="support">
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div v-if="seller.supports" class="support-count" @click="showDetail">
                <span class="count">{{seller.supports.length}}个</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div>
        <div class="bulletin-wrapper">
            <span class="bulletin"></span><span class="bulletin-content">{{seller.bulletin}}</span>
            <i class="icon-keyboard_arrow_right"></i>
        </div>
        <div class="background">
            <img :src="seller.avatar" width="100%" height="100%">
        </div>
        <div v-show="detailShow" class="detail">
            <div class="detail-wrapper clearfix">
                <div class="detail-main"></div>
            </div>
            <div class="detail-close" @click="closeDetail">
                <i class="icon-close"></i>
            </div>
        </div>
    </div>
</template>

<<script type="text/ecmascript-6">
export default {
    created() {
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    data() {
        return {
            detailShow: false
        };
    },
    methods: {
        showDetail() {
            this.detailShow = true;
        },
        closeDetail() {
            this.detailShow = false;
        }
    },
    props: {
        seller: {
            type: Object
        }
    }
};
</script>

<<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin";
    .header
        position: relative
        color: #fff
        background: rgba(7,17,27,0.5)
        overflow: hidden                      
        .content-wrapper
            position: relative
            font-size: 0
            padding: 24px 12px 18px 24px
            .avatar
                display: inline-block
                img
                   border-radius: 2px
            .content
                display: inline-block
                margin-left: 16px
                font-size: 12px  
                .title
                    margin: 2px 0px 8px 0px
                    .brand
                        display: inline-block
                        width: 30px
                        height: 18px
                        bg-image('brand')
                        background-size: 30px 18px
                    .name
                        font-size: 16px 
                        line-height: 18px
                        font-weight: bold
                        margin-left: 6px
                        vertical-align: top
                .description
                    font-size: 12px
                    font-weight: 200
                    line-height: 12px
                    margin-bottom: 10px
                .support
                    .icon
                        vertical-align: top
                        display: inline-block
                        width: 12px
                        height: 12px
                        margin-right: 4px
                        background-size: 12px 12px
                        background-repeat: no-repeat
                        &.decrease
                            bg-image('decrease_1')
                        &.discount
                            bg-image('discount_1')
                        &.guarantee
                            bg-image('guarantee_1')
                        &.invoice
                            bg-image('invoice_1')
                        &.special
                            bg-image('special_1')
                    .text
                        line-height: 12px
                        font-size: 12px
                        font-weight: 200
                        vertical-align: top
            .support-count
                position: absolute
                right: 12px
                bottom: 18px
                padding: 0px 8px
                height: 24px
                line-height: 24px
                border-radius: 14px
                background: rgba(0,0,0,0.2)
                text-align: center
                .count
                    vertical-align: top
                    font-size: 10px
                    font-weight: 200
                .icon-keyboard_arrow_right
                    line-height: 24px
                    margin-left: 2px
                    font-size: 10px
        .bulletin-wrapper
            position: relative
            height: 28px
            line-height: 28px
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
            background-color: rgba(7,17,27,0.2)
            padding: 0px 12px 0px 12px
            .bulletin   
                margin-top: 8px
                display: inline-block 
                bg-image('bulletin')
                width: 22px
                height: 12px  
                background-size: 22px 12px
                background-repeat: no-repeat
                vertical-align: top
            .bulletin-content
                margin: 0 4px 0 4px
                font-size: 10px
                font-weight: 200
                vertical-align: top
            .icon-keyboard_arrow_right
                position: absolute
                right: 12px
                top: 8px
                font-size: 10px
        .background
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
            z-index: -1
            filter: blur(10px)  
        .detail
            position: fixed
            top: 0
            left: 0
            z-index: 100
            width: 100%
            height: 100%
            overflow: auto
            background: rgba(7,17,27,0.8)   
            .detail-wrapper
                min-height: 100%
                .detail-main
                    margin-top: 64px
                    padding-bottom: 64px
            .detail-close
                position: relative
                width: 32px
                height: 32px
                margin: -64px auto 0 auto
                clear: both
                font-size: 32px       

                        
                            

</style>

