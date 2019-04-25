<template>
  <div id="container">
    <header class="header">
      <sbheader class="sbheader"/>
    </header>
    <router-view/>
    <sbfooter class="sbfooter"/>
    <div class="audio-player-container">
      <AudioPlayer v-if="$store.state.songInfo.list.length"
        ref="audioPlayer"
        class="audio-player"
        :music="$store.state.songInfo.curIndex"
        :list="$store.state.songInfo.list"
        :playing="$store.state.songInfo.playing"
        :progress="$store.state.songInfo.progress"
        @indexChange="updateSongIndex"
        @playingChange="updatePlaying"
        @progressChange="updateProgress"
      />
    </div>
    <login />
    <v-dialog />
  </div>
</template>
<script>
  import sbheader from "@/views/Header.vue"
  import sbfooter from "@/views/Footer.vue"
  import AudioPlayer from "@/components/audioPlayer/AudioPlayer.vue"
  import Login from "@/components/Login.vue"
  import { request } from './utils.js'
  export default {
    components: {
      sbheader,
      sbfooter,
      AudioPlayer,
      Login,
    },
    methods: {
      updateSongIndex(idx) {
        this.$store.commit('updateSongIndex', idx)
      },
      updatePlaying(playing) {
        this.$store.commit('updatePlaying', playing)
      },
      updateProgress(val) {
        this.$store.commit('updateProgress', val)
      }
    },
    computed: {
      playing() {
          return this.$store.state.songInfo.playing;
      }
    },
    watch: {
      playing: function (val) {
        console.log(val)
        //val ? this.$refs.audioPlayer.play() : this.$refs.audioPlayer.pause()
      }
    },
    beforeCreate() {
      
    },
    mounted() {
      //this.$modal.show('loginModal')
      this.$router.beforeEach((to, from, next) => {
          if (to.matched.some(record => record.meta.requiresAuth)) {
            if (!this.$store.state.userInfo.islogin) {
              this.$modal.show('loginModal')
              next(false)
            }
            else {
              next()
            }
          } else {
            next()
          }
        })
      if(this.$route.path !== '/') this.$router.push('/')

      request('member/message/remind')
          .then(res => {
            if(res.success) {
              this.$store.state.userInfo.mewMessage = res.data.total ? true : false
            }
      })
      
    },
  }
</script>
<style lang="less">
body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td { margin:0; padding:0; } 
h1, h2, h3, h4, h5, h6{ font-size:100%; } 
address, cite, dfn, em, var { font-style:normal; } 
small{ font-size:12px; } 
ul, ol { list-style:none; } 
a { text-decoration:none; color: unset; } 
a:hover { text-decoration: unset; } 
sup { vertical-align:text-top; } 
sub{ vertical-align:text-bottom; } 
legend { color:#000; } 
fieldset, img { border:0; }
button, input, select, textarea { font-size:100%; outline: none;} 
table { border-collapse:collapse; border-spacing:0; } 



#container {
  font-family: 'PingFangSC-Medium', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .header {
    height: 80px;
    .sbheader {
      position: fixed;
      top: 0;
    }
  }
  .sbfooter {
    padding-bottom: 40px;
  }
  .audio-player-container {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 1px 5px 0 rgba(0, 0, 0, 0.1);
    .audio-player {
      width: 1160px;
      margin: 0 auto;
    }
  }
  .v--modal {
    border-radius: 0;
  }
  .vue-form-generator {
    .form-group.error {
      .input {
        
      }
      .errors {
        color: #E76C7B;
        span {
          background-image: unset;
        }
      }
    }
  }
}
</style>
