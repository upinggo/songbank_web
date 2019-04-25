<template>
  <div class="p-container">
    <div class="p-header" :style="headerbg">
      <div class="h-container">
        <div @click="onIconEdit" class="p-icon">
          <img :src="pinfo.icon"/>
          <i v-if="isMy" class="icon-btn"/>
        </div>
        <div class="p-info">
          <div>
            <div class="p-name">{{pinfo.name}}<i :class="pinfo.gender ? 'man' : ''" /></div><i v-if="isMy" @click="onPEdit" class="p-edit" />
          </div>
          <div class="p-p-one">
            <span><i />{{pinfo.school}}</span>
            <span><i />{{pinfo.course}}</span>
            <span><i />{{pinfo.isstudy}}</span>
          </div>
          <span class="p-p-two"><i />{{pinfo.achievement}}</span>
        </div>
        <div class="p-tools">
          <div v-if="isMy" @click="$store.state.userInfo.verify || onVerify()" class="verify"><i/>{{$store.state.userInfo.verify ? '已认证' : '未认证'}}</div>
          <div v-if="isMy" @click="onBgEdit" class="cover-edit"><i/>上传封面</div>
          <div v-if="isMy" @click="onLogout" class="logout"><i/>退出</div>
        </div>
      </div>
    </div>
    <div class="list-title">
      {{isMy ? "我的作品" : "他的作品"}}
    </div>
    <div class="list">
      <SongItem
        v-for="(item, index) in $store.state.songInfo.list" 
        :key="index"
        :song="item"
        :isMy="isMy"
        :isCurrent="$store.state.songInfo.curIndex === index"
        :playing="$store.state.songInfo.playing"
        :progress="$store.state.songInfo.curIndex === index ? $store.state.songInfo.progress : 0"
        @play="onPlaySong(index)"
        @goSong="onGoSong(index)"
        @progress="progress => onProgress(progress, index)"
        @edit="onEditSong(item.wkid)"
        @open="onOpenSong(item)"
        class="song-item"/>
    </div>
    <div v-if="isMy" class="upload-btn">
      <div v-if="!$store.state.songInfo.list.length" class="empty"/>
      <span>嗨~牛班音乐人！快来上传你的作品吧。</span><br>
      <button @click="onGoUpload">我要上传</button>
    </div>

    <modal name="iconEditer" :height="'auto'">
      <div class="iconEditer">
        <ImageUploader @uploadComplete="onIconUploaded" :enlarge="2" :autoCropWidth="250" :autoCropHeight="250" :fixed="false" tokenKey="avatar"/>
      </div>
    </modal>
    <modal name="bgEditer" :height="'auto'">
      <div class="bgEditer">
        <ImageUploader @uploadComplete="onBgUploaded" :enlarge="3.2" :autoCropWidth="362.5" :autoCropHeight="125" :fixed="false" tokenKey="cover"/>
      </div>
    </modal>
    <PEditModal :info="pinfo"/>
  </div>
</template>
<script>
import SongItem from "@/components/SongItem.vue"
import ImageUploader from "@/components/imageUploader/ImageUploader.vue"
import PEditModal from "@/components/PEditModal.vue"
import MugenScroll from 'vue-mugen-scroll'
import { request } from '../utils.js'
import pIcon from '../assets/icons/p-icon.png'

export default {
  name: "phome",
  data() {
    return {
      isMy: false,
      pinfo: {},

    }
  },
  components: {
    SongItem,
    ImageUploader,
    PEditModal,
  },
  methods: {
    onLogout() {
      this.$modal.show('dialog', {
                      text: '确认退出登录嘛。',
                      buttons: [
                          {
                            title: '确认',
                            handler: () => {
                              request('member/index/logout').finally(()=>{
                                this.$store.commit('logoutSuccess')
                              })
                              this.$modal.hide('dialog')
                            }
                          },
                          {
                            title: '取消'
                          }
                      ]
                    })
    },
    onVerify() {
      this.$router.push('/pverify')
    },
    onEditSong (id) {
      this.$router.push({name:'upload', params: {id: id}})
    },
    onOpenSong (item) {
      request('member/works/setPrivacy',{wkid: item.wkid}).then(
        res => {
          if(res.success)
           {
             item.wkprivacy = 2
           }
        }
      )
    },
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
    fetchData() {
        this.loading = true
      },
    onIconEdit() {
      this.isMy && this.$modal.show('iconEditer')
    },
    onIconUploaded(key, data, color) {
      request('member/user/setAvatar',{useravatarurl: key, useravatarcolor: color}).then(
        res => {
          if(res.success)
           {
             this.pinfo.icon = URL.createObjectURL(data)
             this.pinfo.iconColor = color
             this.$modal.hide('iconEditer')
           }
          else console.log('show:上传失败')
        }
      )
    },
    onBgEdit() {
      this.$modal.show('bgEditer')
    },
    onBgUploaded(key, data, color) {
      request('member/user/setCover',{usercoverurl: key, usercovercolor: color}).then(
        res => {
          if(res.success)
           {
             this.pinfo.cover = URL.createObjectURL(data)
             this.pinfo.coverColor = color
             this.$modal.hide('bgEditer')
           }
          else console.log('show:上传失败')
        }
      )
    },
    onPEdit() {
      this.$modal.show('pEditModal')
    },
    onGoUpload() {
      this.$router.push('/upload')
    }
  },
  computed: {
    headerbg: function() {
      console.log(this.pinfo.cover)
      return this.pinfo.cover ? { background: 'url(' + this.pinfo.cover + ') center, linear-gradient(-90deg, #B9949FF0 0%, ' + this.pinfo.coverColor + ' 80%)'} : { background: 'linear-gradient(-93deg, #B9949FF0 0%, ' + this.pinfo.iconColor + ' 80%)'}
    },
  },
  created () {
    let url = ''
    if(this.$route.params.key !== undefined) {
      url = 'guest/works/hisWorks'
      let song = this.$store.state.songInfo.list[this.$route.params.key]
      this.pinfo = {
        id: song.wkuserid,
        name: song.userfullname,
        icon: song.useravatarurl ? song.useravatarurl : pIcon,
        iconColor: song.useravatarcolor ? song.useravatarcolor : '#9E606B',
        cover: song.usercoverurl,
        coverColor: song.usercovercolor,
        gender: song.usergender,
        school: song.userschool,
        course: song.usercourse,
        isstudy: song.userisstudy,
        achievement: song.userachievement,
      }
    } else if (this.$store.state.userInfo.islogin) {
      this.isMy = true
      url = 'member/works/myWorks'
      this.pinfo = this.$store.state.userInfo
    } else {
      this.$router.push('/')
      return
    }

    request(url, { userid: this.pinfo.id, })
      .then(res => {
        if(res.success) {
          this.$store.commit('setSongList', res.data)
        }
      })
    this.$store.commit('setSongList', [])
  },
  beforeUpdate () {
   // console.log('xxxxxxxx')
  }
}
</script>
<style lang="less" scoped>
  .p-container {
    position: relative;
    width: 100%;
    min-width: 1160px;
    text-align: left;
    .p-header{
      width: 100%;
      padding: 100px 0;
      .h-container {
        display: flex;
        position: relative;
        width: 1160px;
        margin: 0 auto;
        align-items: center;
        .p-icon {
          position: relative;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          cursor: pointer;
          &:hover .icon-btn {
            position: absolute;
            display: block;
            width: 56px;
            height: 56px;
            right: 0;
            bottom: 0;
            left: 0;
            top: 0;
            margin: auto;
            background: url("../assets/icons/camera.png") center center/auto no-repeat;
          }
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .p-info {
          flex: 1;
          padding-left: 24px;
          height: 100%;
          font-size: 14px;
          color: #FFFFFF;
          line-height: 20px;
          i{
              display: inline-block;
              width: 14px;
              height: 14px;
              line-height: 14px;
              vertical-align: text-bottom;
              margin-right: 4px;
          }
          .p-name {
            display: inline-block;
            margin-bottom: 28px;
            width: fit-content;
            height: 34px;
            padding: 5px 8px;
            line-height: 24px;
            background: #4a3237;
            border-radius: 16px;
            box-sizing: border-box;
            font-size: 18px;
            i {
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
          .p-edit {
            width: 20px;
            height: 20px;
            margin-left: 6px;
            line-height: 20px;
            background: url("../assets/icons/edit.png") center center/cover no-repeat;
            cursor: pointer;
          }
          .p-p-one {
            margin-bottom: 16px;
            span {
              margin-right: 25px;
              &:nth-child(1) i {
                background: url("../assets/icons/p-school.png") center/cover no-repeat;
              }
              &:nth-child(2) i {
                background: url("../assets/icons/p-music.png") center/cover no-repeat;
              }
              &:nth-child(3) i {
                background: url("../assets/icons/p-study.png") center/cover no-repeat;
              }
            }
          }
          .p-p-two {
            i {
              background: url("../assets/icons/p-info.png") center/cover no-repeat;
            }
          }
        }
        .p-tools {
            position: absolute;
            top: -40px;
            right: 0px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            color: #fff;
            cursor: pointer;
            text-align: center;
          >div {
            display: inline-block;
            width: 80px;
            margin-left: 16px;
            background-color: #54565b;
            border-radius: 12px;
            i {
              display: inline-block;
              margin-right: 2px;
              width: 12px;
              height: 14px;
              vertical-align: sub;
              
            }
          }
          .logout {
            background-color: unset;
            i {
              background:  url("../assets/icons/logout.png") center/100%  no-repeat;
            }
          }
          .cover-edit {
            i {
              background:  url("../assets/icons/p-info.png") center/100%  no-repeat;
            }
          }
          .verify {
            i {
              background:  url("../assets/icons/verify.png") center/100%  no-repeat;
            }
          }
        }

      }
    }
    .list-title {
      width: 1160px;
      padding: 36px 0 19px 40px;
      margin: 0 auto;
      font-size: 18px;
      border-bottom: 1px solid  #D8D8D8;
      box-sizing: border-box;
    }
    .list {
      width: 1160px;
      margin: 52px auto 0 auto;
      .song-item {
        margin-bottom: 40px; 
      }
    }

    .iconEditer {
      width: 500px;
      margin: 0 auto;
    }
    .bgEditer {
      width: 500px;
      margin: 0 auto;
    }
    .upload-btn {
      margin-top: 44px;
      margin-bottom: 160px;
      text-align: center;
      .empty{
        width: 100%;
        height: 170px;
        background:  url("../assets/icons/empty-page.png") center  no-repeat;
      }
      span {
        padding-top: 40px;
        line-height: 22px;
        font-size: 16px;
        color: #9B9B9B;
      }
      button {
        margin-top: 24px;
        width: 240px;
        height: 48px;
        color: #fff;
        background: #40D77E;
        box-shadow: 0 12px 24px 0 rgba(64, 215, 126, 0.3);
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
</style>