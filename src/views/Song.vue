<template>
  <div class="song">
    <div class="song-cover">
      <div class="cover-img">
        <img :src="song.wkcoverurl"/>
      </div>
      <div class="cover-other">
        <div class="song-name">{{song.wksongname}}</div>
        <div class="song-owner" @click="$router.push({name:'phome', params: {key: $store.state.songInfo.curIndex}})">{{song.userfullname}}</div>
        <div class="add-time">{{parseTime(song.wkaddtime)}}</div>
        <div class="heat">
          <i class="fire"/><i class="fire"/>{{song.hot}}
        </div>
        <div class="match">#{{song.actname}}</div>
        <div class="progress">
          <Progress  :playProgress="$store.state.songInfo.progress" @dragend="onProgress"/>
        </div>
        <div @click="onToggleSong($store.state.songInfo.curIndex)" :class="[$store.state.songInfo.playing ? 'btn-pause': 'btn-play', 'play-btn']"></div>
      </div>
    </div>
    <div class="song-info">
      <div class="owner-info">
        <div class="icon">
          <img :src="song.useravatarurl"/>
        </div>
        <div class="name" @click="$router.push({name:'phome', params: {key: $store.state.songInfo.curIndex}})">
          {{song.userfullname}}<i :class="song.usergender ? 'man' : ''" />
        </div>
        <div class="introduce">
          {{song.userachievement}}
        </div>
        <ul class="other-info">
          <li>
            <span>校区:</span><span>{{song.convert.userschool}}</span>
          </li>
          <li>
            <span>报名科目:</span><span>{{song.convert.usercourse.join(" ")}}</span>
          </li>
          <li>
            <span>学习状态:</span><span>{{song.convert.userisstudy}}</span>
          </li>
        </ul>
      </div>
      <div class="info-right">
        <div class="name">
          {{song.wksongname}}
        </div>
        <ul class="info-other">
          <li>
            <span>歌手 : {{song.wksinger}}</span>
            <span>作词 : {{song.wkwriter}}</span>
          </li>
          <li>
            <span>作曲 : {{song.wkcompositor}}</span>
            <span>编曲 : {{song.wkmelody}}</span>
          </li>
          <li>
            <span>辅导老师 : {{song.wkteacher}}</span>
            <span>大师班导师 : {{song.wkmasterteacher}}</span>
          </li>
        </ul>
        <hr>
        <p class='lrc'>
          {{song.wklyric}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Progress from '@/components/audioPlayer/PlayerControllerProgress.vue'
import { relativelyTime } from '../utils.js'
export default {
  name: "song",
  components: {
    Progress
  },
  data () {
    return {
    }
  },
  methods: {
    onToggleSong (index) {
      this.$store.commit('toggleSong', index)
    },
    onProgress (progress) {
      this.$store.commit('updateProgress', progress)
    },
    parseTime (time) {
      return relativelyTime(time)
    }
  },
  computed: {
    song: function (){
      const songInfo = this.$store.state.songInfo
      return songInfo.list[songInfo.curIndex]
    }
  },
  created: function () {
    if(!this.$store.state.songInfo.list.length) this.$router.push('/')
  }
};
</script>
<style lang="less" scoped>
  .song {
    width: 1440px;
    margin: 0 auto;
    .song-cover {
      width: 100%;
      padding: 80px 140px;
      box-sizing: border-box;
      background-color:#888;
      background-image: linear-gradient(-143deg, #9E606B0e 0%, #9E606B 90%);
      &>div {
        display: inline-block;
      }
      .cover-img {
        width: 360px;
        height: 360px;
        vertical-align: top;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .cover-other {
        position: relative;
        width: 784px;
        margin-left: 16px;
        overflow: hidden;
        color: #fff;
        text-align: left;
        font-size: 14px;
        .song-name {
          font-size: 28px;
          line-height: 40px;
        }
        .song-owner {
          margin-top: 8px;
          line-height: 20px;
          cursor: pointer;
        }
        .add-time {
          margin-top: 4px;
          line-height: 20px;
        }
        .heat {
          margin-top: 20px;
          width: fit-content;
          height: 24px;
          padding: 2px 8px;
          line-height: 20px;
          background: #4a3237;
          border-radius: 16px;
          box-sizing: border-box;
          img {
            height: 100%;
            vertical-align: bottom;
          }
          .fire {
            display: inline-block;
            width: 12px;
            height: 12px;
            line-height: 20px;
            vertical-align: baseline;
            background: url("../assets/icons/fire.png") center center/contain no-repeat;
          }
        }
        .match {
          margin-top: 20px;
          width: fit-content;
          height: 24px;
          padding: 2px 8px;
          line-height: 20px;
          background: #4a3237;
          border-radius: 16px;
          box-sizing: border-box;
        }
        .progress {
          margin-top: 60px;
          width: 100%;
          height: 120px;
          .player-bar-wrap {
            margin: 5px 0;
            height: 100%;
            /deep/.player-bar {
              height: 100%;
              background: url("../assets/icons/progress-s.png") left/auto 100% ;
            }
            /deep/.player-played {
                height: 100%;
                background: url("../assets/icons/progress-played-s.png") left/auto 100% ;
                
            }
            /deep/ .player-thumb {
                  display: none;
            }
          }
        }
        
        .play-btn {
          position: absolute;
          width: 56px;
          height: 56px;
          top: 0;
          right: 0;
          cursor: pointer;
          &.btn-play {
            background: url('../assets/icons/play.png') center no-repeat;
            background-size: cover;
          }
          &.btn-pause {
            background: url('../assets/icons/pause.png') center no-repeat;
            background-size: cover;
          }
        }
      }
    }
    .song-info {
      width: 100%;
      overflow: hidden;
      padding: 60px 260px;
      font-size: 14px;
      color: #666;
      box-sizing: border-box;
      &>div {
        display: inline-block;
      }
      .owner-info {
        width: 180px;
        overflow: hidden;
        text-align: center;
        vertical-align: top;
        .icon {
          width: 100%;
          img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
          }
        }
        .name {
          margin-top: 12px;
          width: 100%;
          font-size: 16px;
          color: #000;
          cursor: pointer;
          i {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-left: 4px;
            line-height: 25px;
            vertical-align: middle;
            background: url("../assets/icons/male.png") center center/cover no-repeat;
            &.man {
              background: url("../assets/icons/man.png") center/cover no-repeat;
            }
          }
        }
        .introduce {
          margin-top: 8px;
          width: 100%;
          overflow-wrap: break-word;
          font-size: 14px;
        }
        .other-info {
          margin-top: 29px;
          width: 100%;
          line-height: 100%;
          li {
            margin-bottom: 24px;
            span {
              display: inline-block;
              vertical-align: top;
              &:first-child {
                width: 70px;
                text-align: right;
              }
              &:last-child {
                margin-left: 10px;
                width: 100px;
                overflow: hidden;
                text-align: left;
                color: #333;
              }
            }
          }
          
        }

      }
      .info-right {
        margin-left: 100px;
        width: 600px;
        text-align: left;
        .name {
          font-size: 24px;
          color: #000000;
        }
        .info-other {
          margin-top: 16px;
          li {
            margin-bottom: 24px;
            width: 100%;
            text-align: left;
            span {
              display: inline-block;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              vertical-align: top;
              &:first-child {
                width: 126px;
              }
              &:last-child {
                margin-left: 10px;
              }
            }
          }
        }
        hr {
          height: 0;
          width: 100%;
          border: 1px solid #E1E1E1;
        }
        .lrc {
          margin-top: 23px;
          white-space: pre-line;
          padding: 0;
          text-align: left;
        }
        
      }
      
    }
  }
</style>