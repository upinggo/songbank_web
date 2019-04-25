<template>
 <div class="home">
   <div class="top-banner">
      <img src="@/assets/home-banner.jpg"/>
    </div>
  <div class="home-container">
    <div class="one-text">
      <span>你的音乐，值得拥有更好的一切。</span>
      <span>-------SongBank 音乐人平台</span>
    </div>
    <div class="top-cantiner">
      <div class="header-bar">
        <div class="list-title">
          <span>往期TOP10</span><i/><br>
          <span>副标题文字说明</span>
        </div>
        <div class="search-bar">
          <input type="text" v-model="searchKey"  placeholder="搜索您喜欢的作品" @keydown="e => e.keyCode === 13 && onSearch()"/> <i @click="onSearch"/>
        </div>
      </div>
      <ul class="song-list">
        <li v-for="(item, index) in this.$store.state.home.list" :key="index">
          <div class="song-cover" @click="onPlaySong(index)">
            <img :src="item.wkcoverurl" />
            <i :class="$store.state.songInfo.curIndex === index && $store.state.songInfo.playing ? 'btn-pause': 'btn-play'"/>
          </div>
          <div class="song-info">
            <span @click="onGoSong(index)">{{item.wksongname}}</span><br>
            <span @click="onGoPhome(index)">{{item.userfullname}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
 </div>

</template>

<script>
// @ is an alias to /src
import { request } from '../utils.js'

export default {
  name: "home",
  components: {
    
  },
  data () {
    return {
      searchKey: ''
    }
  },
  methods: {
    onPlaySong (index) {
      this.$store.commit('toggleSong', index)
    },
    onGoSong (index) {
      this.$store.commit('toggleSong', index)
      this.$router.push('/song')
    },
    onGoPhome (index) {
      this.$router.push({name:'phome', params: {key: index}})
    },
    onSearch () {
      if(this.searchKey)
        this.$router.push({name: 'search', params: {key: this.searchKey}})
    }
  },
  created: function () {
    let { home } = this.$store.state
    if(home.list.length === 0)
      request('guest/works/pastTop', { })
          .then(res => {
            if(res.success) {
              this.$store.commit('setHomeList', res.data)
              this.$store.commit('setSongList', home.list)
            }
          })
    else
      this.$store.commit('setSongList', home.list)
  }
};
</script>
<style lang="less">

  .top-banner{
    width: 100%;
    height: 760px;
    overflow-y: hidden;
    img {
      width: 100%;
    }
  }
  .home-container {
    width: 1440px;
    margin: 0 auto;
    .one-text {
      padding: 127px 0;
      width: 100%;
      box-sizing: border-box;
      span{
        display: block;
        margin: 0 auto;
        width: 690px;
        &:nth-child(1) {
          font-size: 42px;
          letter-spacing: 2.21px;
          text-align: left;
          line-height: 68px;
          padding-top: 24px;
          padding-left: 24px;
          background: url("../assets/icons/“.png") left top / auto no-repeat;
        }
        &:nth-child(2) {
          padding-right: 80px;
          font-size: 18px;
          color: #666;
          text-align: right;
        }
      }
    }
    .top-cantiner {
      width: 100%;
      padding: 90px 180px;
      box-sizing: border-box;
      background-color: #F7F6F6;
      overflow: hidden;
      .header-bar {
        display: flex;
        .list-title {
          flex: 1;
          text-align: left;
          span:nth-child(1) {
            font-size: 28px;
            line-height: 40px;
            letter-spacing: 1.47px;
          }
          span:nth-child(2) {
            font-size: 16px;
            color: #B3B3B3;
            line-height: 26px;
            letter-spacing: 0.84px;
          }
          i {
            display:inline-block;
            width: 28px;
            height: 28px;
            line-height: 1;
            background: url("../assets/icons/mu-icon.png") center no-repeat;
            vertical-align: text-bottom;
          }
        }
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
      }
      .song-list {
        margin-top: 40px;
        width: calc(100% + 45px);
        text-align: left;
        li {
          display: inline-block;
          margin-bottom: 66px;
          width: 180px;
          margin-right: 45px;
          .song-cover {
            position: relative;
            width: 180px;
            height: 180px;
            img {
              width: 100%;
              height: 100%;
            }
            i {
              display: block;
              position: absolute;
              width:152px;
              height: 160px;
              left: 0;
              top: 30px;
              right: 0;
              bottom: 0;
              margin: auto;
              cursor: pointer;
              &.btn-play:hover {
                background: url('../assets/icons/play.png') center no-repeat;
              }
              &.btn-pause {
                background: url('../assets/icons/pause.png') center no-repeat;
              }
            }
          }
          .song-info {
            margin-top:8px;
            font-size: 16px;
            color: #000000;
            line-height: 22px;
            text-align: left;
            span {
              display: inline-block;
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              cursor: pointer;
              overflow: hidden;
              &:nth-child(3) {
                color: #b3b3b3;
              } 
            }
          }
        }
      }
    }
  }
  .image-uploader {
    width: 500px;
    margin: 0 auto;
  }
  .audio-uploader {
    width: 800px;
    margin: 0 auto;
  }
</style>