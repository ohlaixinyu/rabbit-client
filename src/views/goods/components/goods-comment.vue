<template>
    <div class="goods-comment">
    <!-- 评价头部 -->
    <div class="head" v-if="commnentInfo">
      <div class="data">
        <p><span>{{commnentInfo.evaluateCount}}</span><span>人购买</span></p>
        <p><span>{{commnentInfo.praisePercent}}</span><span>好评率</span></p>
      </div>
      <div class="tags" >
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
          href="javascript:;"
          v-for="(item,i) in commnentInfo.tags"
          :key="item.title"
          :class="{active:currentTagIndex===i}"
          @click='changeTag(i)'
          >{{item.title}}({{item.tagCount}})</a>
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a @click="changeSort(null)" href="javascript:;" :class="{active:reqParams.sortField==='null'}">默认</a>
      <a @click="changeSort('createTime')" href="javascript:;" :class="{active:reqParams.sortField==='createTime'}">最新</a>
      <a @click="changeSort('praiseCount')" href="javascript:;" :class="{active:reqParams.sortField==='praiseCount'}">最热</a>
    </div>
    <!-- 评价列表 -->
 <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{formatNickName(item.member.nickname)}}</span>
        </div>
        <div class="body">
          <div class="score">
            <i v-for="i in item.score" :key="i+'s'" class="iconfont icon-wjx01"></i>
            <i v-for="i in 5-item.score" :key="i+'k'" class="iconfont icon-wjx02"></i>
            <span class="attr">{{formatSpecs(item.orderInfo.specs)}}</span>
          </div>
          <div class="text">{{item.content}}</div>
          <!-- 评论大图 -->
          <goodsCommentImage v-if="item.pictures.length" :pictures="item.pictures"/>
          <div class="time">
            <span>{{item.createTime}}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <xtx-pagination v-if="commnentInfo" @current-change='changePagerFn' :total='total' :page-size='reqParams.pageSize' ::current-page='reqParams.page'/>
    </div>
</template>

<script>
import { findCommentInfoByGoods, findGoodsCommentList } from '@/api/goods'
import { inject, reactive, ref, watch } from 'vue'
import goodsCommentImage from './goods-comment-image.vue'

export default {
  components: { goodsCommentImage },
  name: 'GoodsComment',
  setup () {
    const goods = inject('goods')
    const commnentInfo = ref(null)
    const currentTagIndex = ref(0)
    findCommentInfoByGoods(goods.value.id).then(data => {
      // 设置数据前 tags数组追加 有图tag 全部评价tag
      data.result.tags.unshift({ title: '有图', tagCount: data.result.hasPictureCount, type: 'img' })
      data.result.tags.unshift({ title: '全部评价', tagCount: data.result.evaluateCount, type: 'all' })
      commnentInfo.value = data.result
    })
    // 激活tag
    const changeTag = (index) => {
      currentTagIndex.value = index
      // 点击tag修改筛选条件
      const tag = commnentInfo.value.tags[index]
      // 全部评价
      if (tag.type === 'null') {
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (tag.type === 'img') {
        reqParams.hasPicture = true
        reqParams.tag = tag.title
      }
      // 页码重置
      reqParams.page = 1
    }

    // 点击排序
    const changeSort = (sortField) => {
      reqParams.sortField = sortField
      // 页码重置
      reqParams.page = 1
    }

    // 准备筛选数据
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      sortField: null
    })

    const commentList = ref([])
    const total = ref(0)
    // 初始化发送请求，筛选条件发生改变 也要发请求
    watch(reqParams, () => {
      findGoodsCommentList(goods.value.id, reqParams).then(data => {
        commentList.value = data.result.items
        total.value = data.result.counts
      })
    }, {
      immediate: true
    })

    // 定义转换数据得函数 对应vue2.0得过滤器
    const formatSpecs = (specs) => {
      return specs.reduce((p, c) => `${p} ${c.name}:${c.nameValue}`, '').trim()
    }
    // 匿名过滤
    const formatNickName = (nickName) => {
      return nickName.substr(0, 1) + '****' + nickName.substr(-1)
    }

    // 实现分页切换
    const changePagerFn = (newPage) => {
      reqParams.page = newPage
    }

    return { commnentInfo, currentTagIndex, changeTag, reqParams, changeSort, commentList, formatSpecs, total, changePagerFn, formatNickName }
  }
}
</script>

<style scoped lang='less'>
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor,50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,&:hover {
        color: @xtxColor;
      }
    }
  }
    .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
