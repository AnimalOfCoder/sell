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
                    <span class="icon"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
        </div>
        <div class="bulletin-wrapper"></div>
    </div>
</template>

<<script type="text/ecmascript-6">
export default {
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
        color: #fff
        background: #000
        .content-wrapper
            font-size: 0
            padding: 24px 12px 18px 24px
            .avatar
                display: inline-block
                img
                   border-radius: 2px
            .content
                display: inline-block
                margin-left: 16px
                font-size: 16px  
                .title
                    margin: 2px 0px 8px 0px
                    .brand
                        display: inline-block
                        width: 30px
                        height: 18px
                        bg-image('brand')
                        background-size: 30px 18px
                    .name
                        line-height: 18px
                        font-weight: bold
                        margin-left: 6px
                        vertical-align: top
                .description
                    font-size: 12px
                    font-weight: 200
                    line-height: 12px
                    margin-bottom: 10px
                // .support
                //     margin-bottom: 2px

                        
</style>

