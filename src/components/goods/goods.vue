<<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menuWrapper">
            <ul class="menu">
                <li v-for="(item, index) in goods" class="menu-item" :class="{ current: currentIndex===index }" @click="selectMenu(index,$event)">
                    <span class="text border-1px">
                        <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
                        {{item.name}}</span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodsWrapper">
            <ul>
                <!-- food-list-hook无样式，只是用来被js选择 -->
                <li v-for="item in goods" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li v-for="food in item.foods" class="food-item border-1px">
                            <div class="icon">
                                <img :src="food.icon" width="57px" height="57px">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="new-price">￥{{food.price}}</span><span class="old-price" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
const ERR_OK = 0;
export default {
    data() {
        return {
            goods: [],
            listHeight: [],
            scrollY: 0
        };
    },
    computed: {
        // 当前可见内容区域索引
        currentIndex() {
            for (let i = 0; i < this.listHeight.length; i++) {
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i + 1];
                if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                    return i;
                }
            }
            return 0;
        }
    },
    created() {
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        // GET
        this.$http.get('/api/goods').then(response => {
            response = response.body;
            if (response.errno === ERR_OK) {
            this.goods = response.data;
            /*
                vue根据数据变化更新DOM是异步的过程，所以会导致_initScorll()计算DOM高度出现问题，需要使用vm.$nextTick( [callback] ）
                函数说明：将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
            */
            this.$nextTick(() => {
                this._initScorll();
                this._calculateHeight();
            });
            }
        }, response => {
            // error callback
        });
    },
    methods: {
        // 初始化beteerScroll插件方法
        _initScorll() {
            this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                /*
                类型：Boolean
                默认值：false
                作用：better-scroll 默认会阻止浏览器的原生 click 事件。
                当设置为 true，better-scroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true。
                */
                click: true
            });
            this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                /*
                类型：Number
                默认值：0
                可选值：1、2、3
                作用：有时候我们需要知道滚动的位置。
                当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
                当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
                当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
                如果没有设置该值，其默认值为 0，即不派发 scroll 事件。
                */
                probeType: 3
            });
            // 绑定foodScroll，计算纵轴滚动偏移量
            this.foodsScroll.on('scroll', (pos) => {
                this.scrollY = Math.abs(Math.round(pos.y));
            });
        },
        // 计算可见内容的对应高度
        _calculateHeight() {
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            let height = 0;
            this.listHeight.push(height);
            for (let i = 0; i < foodList.length; i++) {
                let item = foodList[i];
                // clientHegiht表示浏元素的可见高度
                height += item.clientHeight;
                this.listHeight.push(height);
            }
        },
        // 菜单选中触发滚动
        selectMenu(index, event) {
            // 浏览器原生点击事件无该属性，表明在PC模式
            if (!event._constructed) {
                return;
            }
            console.log(index);
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            // 获取与menu与food对应索引的food中的DOM
            let el = foodList[index];
            /*
            scrollToElement(el, time, offsetX, offsetY, easing)
            参数：
            {DOM | String} el 滚动到的目标元素, 如果是字符串，则内部会尝试调用 querySelector 转换成 DOM 对象。
            {Number} time 滚动动画执行的时长（单位 ms）
            {Number | Boolean} offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
            {Number | Boolean} offsetY 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置
            {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
            返回值：无
            作用：滚动到指定的目标元素。
            */
            this.foodsScroll.scrollToElement(el, 300);
        }
    }
};
</script>

<<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin";
    .goods
        display: flex
        position: absolute
        top: 176px
        bottom: 46px
        width: 100%
        overflow: hidden
        .menu-wrapper
            flex: 0 0 80px
            width: 80px
            background: #f3f5f7
            .menu
                .menu-item
                    display: table
                    width: 56px
                    height: 54px
                    line-height: 14px
                    padding: 0 12px
                    &.current
                        position: relative
                        z-index: 10
                        margin-top: -1px
                        background: #fff
                        font-weight: 700
                        .text
                            border-none(after)
                    .icon
                        vertical-align: top
                        display: inline-block
                        width: 12px
                        height: 12px
                        margin-right: 2px
                        background-size: 12px 12px
                        background-repeat: no-repeat
                        &.decrease
                            bg-image('decrease_3')
                        &.discount
                            bg-image('discount_3')
                        &.guarantee
                            bg-image('guarantee_3')
                        &.invoice
                            bg-image('invoice_3')
                        &.special
                            bg-image('special_3')
                    .text
                        display: table-cell
                        vertical-align: middle
                        width: 56px
                        font-size: 12px
                        border-1px(rgba(7,17,27,0.1))  
        .foods-wrapper 
            flex: 1
            .title
                font-size: 12px
                color: rgb(147,153,159)
                line-height: 26px
                height: 26px
                padding-left: 14px
                background: #f3f5f7
                border-left: 2px solid #d9dde1
            .food-item
                display: flex
                margin: 18px
                padding-bottom: 18px
                border-1px(rgba(7,17,27,0.1))
                &.last-child
                    border-none(after)
                    margin-bottom: 0
                .icon
                    flex: 0 0 57px
                    margin-right: 10px
                .content
                    padding-top: 2px
                    .name
                        line-height: 14px
                        font-size: 14px
                        color: rgb(7,17,27)
                    .desc
                        margin: 8px 0
                        line-height: 12px
                        font-size: 10px
                        color: rgb(147,153,159) 
                    .extra
                        margin-bottom: 8px
                        line-height: 10px
                        font-size: 10px
                        color: rgb(147,153,159) 
                        .count
                            margin-right: 12px
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

</style>

