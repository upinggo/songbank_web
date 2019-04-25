<template>
  <div class="container">
    <div class="search-bar">
          <input v-model="inputkey" placeholder="搜索您喜欢的作品" @keydown="e => e.keyCode === 13 && search()"/> <i @click="search" />
    </div>
    <div v-if="list.length" class="list">
      <SongItem
        v-for="(item, index) in $store.state.songInfo.list"
        :key="index"
        :song="item"
        :isMy="false"
        :progress="$store.state.songInfo.curIndex === index ? $store.state.songInfo.progress : 0"
        :isCurrent="$store.state.songInfo.curIndex === index"
        :playing="$store.state.songInfo.playing"
        @play="onPlaySong(index)"
        @goSong="onGoSong(index)"
        @progress="progress => onProgress(progress, index)"
        class="song-item"/>
    </div>
    <div v-if="!list.length && !loading" class="notfound">
      抱歉，没有搜到符合条件的结果，请尝试一下别的条件
    </div>
    <mugen-scroll v-show="loading || page === totalPage" :handler="nextPage" :should-handle="!loading">
      {{loadingText}}
    </mugen-scroll>
  </div>
</template>
<script>
import SongItem from "@/components/SongItem.vue"
import MugenScroll from 'vue-mugen-scroll'
import { request } from '../utils.js'
const initData = {
    list: [],
    page: 0,
    totalPage:1,
}
export default {
  name: "search",
  data() {
    return {
      inputkey: '',
      searchkey:'',
      list: initData.list,
      page: 0,
      totalPage: 1,
      pageSize: 50,
      loading: false,
      loadingText: '滚动加载',
    }
  },
  watch: {
    list: function (val) {
      this.$store.commit('setSongList', val)
    },
    loading: function (val) {
      if(this.page < this.totalPage || !this.searchkey) this.loadingText = '全部加载完成。'
    }
  },
  components: {
    SongItem,
    MugenScroll,
  },
  methods: {
    onPlaySong (index) {
      this.$store.commit('toggleSong', index)
    },
    onGoSong (index) {
      this.$store.commit('toggleSong', index)
      this.$router.push('/song')
    },
    onProgress (progress, index) {
      if(this.$store.state.songInfo.curIndex !== index) this.$store.commit('toggleSong', index)
      this.$store.commit('updateProgress', progress)
    },
    search() {
      this.list = initData.list
      this.totalPage = initData.totalPage
      this.page = initData.page
      this.searchkey = this.inputkey
      this.nextPage()
    },
    nextPage() {
        if(this.searchkey && this.page < this.totalPage)
        {
          this.loading = true
          request('guest/works/search', { keyword: this.searchkey, page: this.page + 1, pageSize: this.pageSize })
          .then(res => {
            if(res.success) {
              this.list = this.list ? this.list.concat(res.data.data) : res.data.data
              this.totalPage = res.data.totalPage
              this.page = res.data.page
            }
          }).finally(res => this.loading = false)
        }
    }
  },
  created: function () {
    this.inputkey = this.$route.params.key
    if(this.inputkey) this.search()
    else this.inputkey = ''
  }
}
</script>
<style lang="less" scoped>
  .container {
    position: relative;
    width: 1160px;
    margin: 0 auto;
    padding-top: 90px;
    .search-bar {
      position: relative;
      width: 450px;
      input {
        position: absolute;
        left: 0;
        padding-bottom: 5px;
        bottom: 0px;
        width: 100%;
        font-size: 18px;
        line-height: 26px;
        border: none;
        background: none;
        outline: none;
        border-bottom: 1px solid #333;
        &:focus {
          border-bottom: 1px solid #40D77E;
        }
      }
      i {
        display:inline-block;
        position: absolute;
        bottom: 5px;
        right: 0;
        width: 25px;
        height: 25px;
        background: url("../assets/icons/search-black.png") center no-repeat;
        cursor: pointer;
        &:hover {
          background: url("../assets/icons/search-active.png") center no-repeat;
        }
      }
    }
    .list {
      width: 100%;
      margin-top: 80px;
      .song-item {
        margin-bottom: 40px; 
      }
    }
    .notfound {
      height: 600px;
      padding-top: 30px;
      text-align: left;
      font-size: 12px;
      color: #9B9B9B;
      background: url("../assets/icons/notfound.png") center no-repeat;
    }
    .mugen-scroll {
      padding: 0 0 20px;
      color: #40D77E;
    }
  }
</style>