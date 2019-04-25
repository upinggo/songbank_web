<template>
  <div class="item-container">
    <div class="cover">
      <img :src="song.wkcoverurl"/>
      <i :class="isCurrent && playing ? 'btn-pause': 'btn-play'" @click="onPlaySong"/>
    </div>
    <div class="info">
      <div class="name">
        <span @click="$emit('goSong')">{{song.wksongname}}</span>
        <span v-if="isMy && song.wkckstatus !== 2 " @click="$emit('edit')" class="edit"><i />编辑</span>
        <span v-if="isMy && song.wkckstatus === 2 && song.wkprivacy === 1" @click="$emit('open')" class="lock"><i /></span>
      </div>
      <div class="info-one">
        <span @click="!isMy && $router.push({name:'phome', params: {key: $store.state.songInfo.curIndex}})">上传者：{{song.userfullname}}</span>
        <span>校区：{{song.convert.userschool}}</span>
      </div>
      <div class="info-two">
        <span>歌手：{{song.wksinger}}</span>
        <span>作词：{{song.wkwriter}}</span>
        <span>作曲：{{song.wkcompositor}}</span>
        <span>编曲：{{song.wkmelody}}</span>
      </div>
      <div class="progress">
        <Progress  :playProgress="progress" @dragend="onProgress"/>
      </div>
      <div class="info-three">
        <div v-if="isMy" class="state">
          <span>·</span>{{song.convert.wkckstatus}}
        </div>
        <div class="heat"> <i class="fire"/><i class="fire"/>  {{song.hot}}</div>
        <div class="date">{{parseTime(song.wkaddtime)}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import Progress from './audioPlayer/PlayerControllerProgress.vue'
import { relativelyTime } from '../utils.js'

export default {
  components:{
    Progress
  },
  props: {
    song: {
      type: Object,
      required: true,
    },
    isMy: {
      type: Boolean,
      default: false,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    playing: {
      type: Boolean,
      default: false,
    },
    progress: {
      type: Number,
      default: 0,
    }
  },
  methods: {
    onPlaySong () {
      this.$emit('play')
    },
    parseTime (time) {
      return relativelyTime(time)
    },
    onProgress (percentage) {
      this.$emit('progress', percentage)
    }
  },
  created: function () {
  }
}
</script>
<style lang="less" scoped>
  .item-container {
    position: relative;
    display: flex;
    padding-bottom: 40px;
    width: 100%;
    border-bottom: 1px solid #E1E1E1;
    .cover {
      position: relative;
      width: 160px;
      height: 160px;
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
    .info {
      flex: 1;
      margin-left: 16px;
      color:  #B3B3B3;
      font-size: 12px;
      text-align: left;
      .name {
        font-size: 16px;
        color: #333333;
        line-height: 22px;
        span {
          &:hover {
            color: #40D77E;
          }
          cursor: pointer;
          img {
            height: 100%;
          }
        }
        i {
          display: inline-block;
          width: 20px;
          height: 20px;
          vertical-align: middle;
        }
        .edit {
          margin-left: 4px;
          i {
              background: url("../assets/icons/edit.png") center center/cover no-repeat;
          }
        }

        .lock {
          margin-left: 4px;
          i {
              background: url("../assets/icons/lock.png") center center/cover no-repeat;
          }
        }
      }
      .info-one {
        margin-top: 6px;
        color: #333333;
        span{
          display: inline-block;
          width:180px;
          margin-right: 4px;
          line-height: 17px;
          cursor: pointer;
          &:hover {
            color: #40D77E;
          }
        }
      }
      .info-two {
        margin-top: 14px;
        span {
          display: inline-block;
          width:180px;
          margin-right: 4px;
          line-height: 17px;
        }
      }
      .progress {
        margin-top: 22px;
        width: 100%;
        height: 60px;
        .player-bar-wrap {
          margin: 5px 0;
          height: 100%;
          /deep/.player-bar {
            height: 100%;
            background: url("../assets/icons/progress.png") left/contain ;
          }
          /deep/.player-played {
              height: 100%;
              background: url("../assets/icons/progress-played.png") left/auto 100% ;
              
          }
          /deep/ .player-thumb {
                display: none;
          }
        }
      }
      .info-three {
        position: absolute;
        top: 0;
        right: 0;
        text-align: right;
        .state, .heat {
          font-size: 14px;
          color: #333333;
          line-height: 22px;
          i {
            display: inline-block;
            height: 100%;
            vertical-align: text-bottom;
          }
        }
        .heat {
          .fire {
            display: inline-block;
            width: 12px;
            height: 12px;
            line-height: 20px;
            vertical-align: baseline;
            background: url("../assets/icons/fire.png") center center/contain no-repeat;
          }
        }
        .state {
          span {
            color: red;
          }
        }
        .date {
          margin-top: 6px;
          line-height: 17px;
        }
      }
    }
  }
</style>


