<template>
  <div class="current">
    <div class="top-banner">
      <img src="../assets/current-banner.jpg"/>
    </div>
    <div class="description">
      在这里，你的愿望统统都可以实现！
      <div class='show-icon'>
            <div class="icon icon1">
            同步发布至主流音乐平台
            </div>
            <div class="icon icon2">
            明星制作人助力发行专辑
            </div>
            <div class="icon icon3">
            拥有自己专属的音乐视频
            </div>
            <div class="icon icon4">
            报名大师课Get创作技能
            </div>
      </div>
    </div>
    <div class="top-cantiner">
      <div class="header-bar">
        <div class="list-title">
          <router-link :class="{active:type=='intro'}"  to="/current/intro">活动介绍</router-link>
          <router-link to="/current/calender">活动日程</router-link>
          <router-link to="/current/rule">评选规则</router-link>
          <router-link to="/current/know">投稿须知</router-link>
          <router-link to="/current/lesson">创作大师课</router-link>
        </div>
      </div>
      <div class='text t-mid'  v-if='type=="intro"'>
      <p>Songbank音乐人平台是牛班创建的<strong ><img class='w b' src='../assets/icons/c_icon1/1.png'>原创歌曲展示和输出的平台<img class='h' src='../assets/icons/c_icon1/3.png'></strong></p>
      旨意让牛班学员们施展创作才华，发掘最具潜力的音乐人才。<br>
      活动由专业评审团依据参赛作品播放量统计，严格筛选出前十二强。<br/>
      入围作品将会得到专业的改编与重制<br/>
      更有机会<strong ><img class='w b' src='../assets/icons/c_icon1/2.png'>发行实体专辑和专属音乐视频。<img class='h' src='../assets/icons/c_icon1/4.png'></strong>
      </div>
      <div class='text' v-if='type=="calender"'>
      
      </div>
      <div class='text' v-if='type=="rule"'>
      1. 登录Songbank活动官网，上传个人原创作品。<br/>
      2.参赛作品需围绕<i><img class='h'  src='../assets/icons/c_icon3/1.png'>当期的两个主题<img class='h' src='../assets/icons/c_icon3/2.png'></i>进行创作。<br/>
      3. 所有合作音乐平台将合计后台播放数据，实时更新至Songbank榜单，搜索即可进入查看。<br/>
      4. 比赛结合播放数据和专业评审团的意见，评出最终<i class='tweleve'>十二强</i>，歌曲将收入专辑发行并<i class='music1'>拍摄</i><i class='music2'>专属</i><i class='music3'>音乐视频</i>。<br/>
      5.<i><img class='w b' src='../assets/icons/c_icon3/0.png'> 奖项及版权分成等事宜，以上传者</i><i><img class='w b' src='../assets/icons/c_icon3/00.png'>实名信息资料为准，如作品由多人创作</i>，则具体分成由上传者与其余创作者自行协商完成。
      </div>
      <div class='text' v-if='type=="know"'>
      1.参赛者必须保证作品词曲<i class='ti'>至少一项为本人创作<img class='h-s' src='../assets/icons/c_icon4/1.png'></i>。<br/>
      2.上传时需保证信息填写完整，附上封面图片，作品需为<i class='ti1'>不少于90秒</i>的音乐作品。<br/>
      3.本次活动仅接受包含词曲创作与人声的原创作品，无人声/remix/<i class='ti1'>鬼畜等作品</i><i class='not1'>不</i><i class='not2'>在</i>征集范围内。<br/>
      4.参赛者需填写真实有效的参赛信息，并仔细阅读上传协议。<i><img class='h'  src='../assets/icons/c_icon4/2.png'></i>
      </div>
      <div class='text' v-if='type=="lesson"'>
      我们针对当期主题为大家安排了有趣的大师课程，大师课<i class='topic'>每期玩转两个主题</i>，将有专业的作曲老师带你学习写歌，作词老师针对主题进行词作修改，经专业老师<i><img class='w b'  src='../assets/icons/c_icon2/2.png'>一</i>对<i><img class='w b'  src='../assets/icons/c_icon2/3.png'>一</i>的辅导和修改后，最终你将迎来进入专业<i class='record'>录音棚录制</i>自己原创作品的绝佳机会哦~<i><img class='h'  src='../assets/icons/c_icon2/6.png'></i>
      <br/><br/>
      价格：6000元／人／期，报名学员每完成并提交一首有效作品将获得奖学金<i class='mon'>500</i>元。
      </div>
      <router-link class='attend' to="/">我要参赛</router-link>
      
    </div>
    <div class='detail-cantiner'>
      <div class="title"><img src='../assets/title.png'></div>
    <div class="search-bar">
        <div class="list-title">
          
          <span :class="{col:show=='last'}" @click="last()">最新</span>|
          <span :class="{col:show=='hot'}" @click='hot()'>最热</span>
          <span >主题<i/></span>
        </div>
        <div class="swork">
          <input type="text" v-model="searchKey"  placeholder="搜索您喜欢的作品"/> <i @click="onSearch"/>
        </div>
        
      </div>
      <ul class="song-list">
        <li>
          <div class="song-cover">&nbsp;</div>
          <span>歌名</span>
          <span>演唱者</span>
          <span>作词</span>
          <span>作曲</span>
          <span>编曲</span>
          <span>校区</span>
          <span>上传者</span>
          <span>指数</span>
        </li>
        <li v-for="(item, index) in this.$store.state.current.list" :key="index" :class="$store.state.songInfo.curIndex === index && $store.state.songInfo.playing ? 'li-bg': 'li-no-bg'">
          <div class="song-cover" @click="onPlaySong(index)">
            <img :src="item.wkcoverurl" />
            <i :class="$store.state.songInfo.curIndex === index && $store.state.songInfo.playing ? 'btn-pause': 'btn-play'"/>
          </div>  
          <div @click="onGoSong(index)" class="song-info">
           <span>{{item.wksongname}}</span>
            <span>{{item.wksinger}}</span>
            <span>{{item.wkwriter}}</span>
            <span>{{item.wkcompositor}}</span>
            <span>{{item.wkmelody}}</span>
            <span>{{item.convert.userschool}}</span>
            <span>{{item.subname}}</span>
            <span><img src='../assets/icons/c_index.png' v-if='index==1'/>
            <img src='../assets/icons/c_index.png' v-if='index==0' v-for='i of 3'/>{{item.like}}
              </span>
          </div>
        </li>
      </ul>
      <router-link class='attend_img' to="/"><img src='../assets/current_attend.png'></router-link>
    </div>
  </div>
</template>

<script>
import {request} from '../utils'
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
export default {
  name: "current",
  components: {
    
  },
  data () {
    return {
       searchKey: '',
      show:'last',
      type:'intro',
      songList: []
    }
  },
  methods: {
    onSearch () {
      if(this.searchKey)
        this.$router.push({name: 'search', params: {key: this.searchKey}})
    },
   
    onGoSong (index) {
      this.$store.commit('toggleSong', index)
      this.$router.push('/song')
    },
    onGoPhome (index) {
      this.$router.push({name:'phome', params: {key: index}})
    },
    hot(){
      let { current } = this.$store.state
      request('/guest/works/search', {sortField:'hot' })
          .then(res => {
            if(res.success) {
              this.$store.commit('setCurrentList', res.data.data)
              this.$store.commit('setSongList', current.list)
            }
          })
     this.show='hot'
    },
    last(){
      let { current } = this.$store.state
      
     this.show='last';
     request('/guest/works/search', {sortField:'wkaddtime' })
          .then(res => {
            if(res.success) {
              this.$store.commit('setCurrentList', res.data.data)
              this.$store.commit('setSongList', current.list)
            }
          })
    },
    onPlaySong (index) {
      this.$store.commit('toggleSong', index)
    },
    changerouter(){
 var type=this.$route.params.type;
 this.type=type?type:'intro'
    
    }
  }, watch: {
            '$route': 'changerouter'
        },
  created: function () {
     let { current } = this.$store.state
    if(current.list.length === 0)
      request('/guest/works/search', { })
          .then(res => {
            if(res.success) {
              this.$store.commit('setCurrentList', res.data.data)
              
              this.$store.commit('setSongList', current.list)
             
            }
          })
    else
    this.$store.commit('setSongList', current.list)
  },

  mounted() {
   
  },
};
</script>
<style lang="less" scoped>
.li-bg{
  padding:10px;
  margin-bottom: 20px!important;
  span{
color:#FF4D73!important;
  }
  
}
.li-no-bg{
  padding:10px;
  margin-bottom: 20px!important;
  span{
  color:white!important;
  }
}

  .current {
    width: 1440px;
    margin: 0 auto;
    .detail-cantiner{
      a{
          position:absolute;
          top:50%;
          right:1%;
      }
       background:url('../assets/c_nbg.png') center no-repeat;
      background-size:100% 100%;
      position:relative;
      ul.song-list{
        padding:0px 0 80px;
        
        margin:0 auto;
        width: 80%;
        text-align:left;
        color:white;
        li{
          border-radius:5px;
          white-space:nowrap;
          &:first-child{
            background:none;
            color:grey;
            margin-bottom: 0;
            &:hover{
              cursor: inherit;
              background:none;
            }
          }
          .song-cover{width:90px;
          }
          span{
            flex:1;
          }
          width:100%;
          display:flex;
          justify-content:space-between;
          
          div:not(.song-cover){
            display:flex;
            justify-content:space-between;
            flex:1;
            span{
              
          
              color:white;
            }
          }
        }
        
      }
      padding-top:20px;
      background-color:black;
      color:white;
      .title{
        
        margin: 30px auto 0;

      }
      .search-bar{
        padding:80px 0;
        display:flex;
        justify-content:space-between;
        margin:0 auto;
        width: 80%;
        text-align:left;
        .swork{
          
          position: relative;
          width: 450px;
          right:0;
          border-bottom: 1px solid  #FFFFFF;
          input {
            color:white;
            position: absolute;
            left: 0;
            bottom: 5px;
            width: 410px;
            font-size: 10px;
            line-height: 20px;
            border: none;
            background: none;
            outline: none;
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
        span{
        padding:10px;
        &:hover{
          cursor: pointer;
        }
        &.col{
          color:#FF4D73;
        }
      }
      input {
            position: absolute;
            left: 0;
            bottom: 5px;
            width: 410px;
            font-size: 18px;
            line-height: 26px;
            border: none;
            background: none;
            outline: none;
          }
      }
      
    }
    .top-banner{
      width: 100%;
      height: 760px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .description {
      color:white;
      text-align:center;
      padding:90px 0;
      width: 100%;
      background: #000000;
      background: -moz-linear-gradient(left center,  #1C1966 100%, #F3A3C7 100%);
      background: -webkit-gradient(linear, left top, right bottom, from(#F3A3C7),to(#1C1966 ));
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1C1966', endColorstr='#F3A3C7',GradientType=1 );
      .show-icon{
      overflow:hidden;
      display:flex;
      justify-content: center;
      margin:0 auto;
        width:785px;
        .icon{
          // width:130px;
          height:150px;
              font-size: 12px;
          line-height:300px;
          float:left;
          padding:0 10px 20px;
        }
        .icon1{
          background:url("../assets/icons/corpo.png") center  no-repeat;
          background-size:75px 75px;
        }
        .icon2{
          background:url("../assets/icons/song.png") center no-repeat;
          background-size:75px 75px;
        }
        .icon3{
          background:url("../assets/icons/video.png") center no-repeat;
          background-size:75px 75px;
        }
        .icon4{
          background:url("../assets/icons/skill.png") center no-repeat;
          background-size:75px 75px;
        }
    }
    }
    .top-cantiner {
      background:url('../assets/c_bg.png') center no-repeat;
      background-size:100% auto;
      height:600px;
      position:relative;
      .text{
        .topic{
          display:inline-block;
          background:url('../assets/icons/c_icon2/1.png') center no-repeat;
        }
        .tweleve{
          // height:100px;
          display:inline-block;
          background:url('../assets/icons/c_icon3/3.png') center no-repeat;
        }
        .music1{
          display:inline-block;
          background:url('../assets/icons/c_icon3/4.png') center no-repeat;
        }
        .music2{
          display:inline-block;
          background:url('../assets/icons/c_icon3/5.png') center no-repeat;
        }
        .music3{
          display:inline-block;
          background:url('../assets/icons/c_icon3/6.png') center no-repeat;
        }
        .ti{
            display:inline-block;
          background:url('../assets/icons/c_icon4/7.png') center no-repeat;
          }
          .ti1{
            display:inline-block;
          background:url('../assets/icons/c_icon4/6.png') center no-repeat;
          }
          .not1{
            display:inline-block;
          background:url('../assets/icons/c_icon4/3.png') center no-repeat;
          }
          .not2{
            display:inline-block;
          background:url('../assets/icons/c_icon4/4.png') center no-repeat;
          }
          .mon{
 display:inline-block;
          background:url('../assets/icons/c_icon2/7.png') center no-repeat;
          }
          .record{
             display:inline-block;
          background:url('../assets/icons/c_icon2/5.png') center no-repeat;
          }
        strong,i{
          position:relative;
          img{
            position:absolute;
            bottom:0;
            height:100%;
          }
          img.h-s{
            height:80%
          }
          img.h{
            position:absolute;
            bottom:0;
            height:150%;
          }
          
          img.w{
            position:absolute;
            bottom:0;
            width:100%;
          }
          .b{
            bottom:-10px!important;
          }
        }
        // .c1_t1{
        //   background:url('../assets/icons/c_icon1/1.png') bottom no-repeat;
        //   background-size:100% auto;
        // }
        // .c1_t2{
        //   background:url('../assets/icons/c_icon1/2.png') bottom no-repeat
        // }
        color:white;
        width:685px;
        margin:0 auto;
        padding:100px 0;
        text-align:left;
        line-height: 40px;
      }
      .t-mid{
        text-align:center;
      }
      width: 100%;
      
      box-sizing: border-box;
      background-color: #000;
      overflow: hidden;
      .header-bar {
        width:100%;
           border-bottom:1px solid white;
        
        // display: flex;
        
        .list-title {
          display:flex;
           justify-content:space-around;
        width:80%;
        margin:0 auto -1px;
        padding:28px 0 0;
          a{
            flex:0.09;
      font-size: 18px;
      color: #FFFFFF;
      letter-spacing: 0.95px;
      text-align: center;
      line-height:56px;
      &.router-link-exact-active,&.active{
      border-bottom:white 3px solid;
    }
          }
        }
        }
        a.attend{
             position: absolute;
    bottom: 50px;
    left: 0;
    right: 0;
    background: -webkit-gradient(linear, left top, right bottom, from(#F3A3C7), to(#1C1966));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#1C1966', endColorstr='#F3A3C7', GradientType=1);
    width: 20%;
    line-height: 48px;
    display: block;
    margin: 0 auto;
    border-radius: 5px;
    color: white;
        }
      }
      .song-list {
        margin-top: 40px;
        width: calc(100% + 45px);
        text-align: left;
        li {
          
          text-align: center;
          &:hover{
            cursor:pointer;
             background: -moz-linear-gradient(left center,  #1C1966 100%, #F3A3C7 100%);
    background: -webkit-gradient(linear, left top, right bottom, from(#F3A3C7),to(#1C1966 ));
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1C1966', endColorstr='#F3A3C7',GradientType=1 );
          }
          background-color:black;
          display: inline-block;
          margin-bottom: 66px;
          // width: 180px;
          margin-right: 45px;
          .song-cover {
            position: relative;
            width: 90px;
            height: 90px;
            img {
              width: 100%;
              height: 100%;
            }
            i {
              display: block;
              position: absolute;
              width:76px;
              height: 80px;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
              margin: auto;
              cursor: pointer;
              &.btn-play:hover {
                background-size:100%;
                background: url('../assets/icons/c_play.png') center no-repeat;
                
              }
              &.btn-pause {
                background-size:100%;
                background: url('../assets/icons/c_stop.png') center no-repeat;
              }
            }
          }
          .song-info {
            margin-top:8px;
            font-size: 16px;
            color: #000000;
            line-height: 22px;
            text-align: center;
            span {
              line-height: 82px;
              
              width: 100%;
              &:nth-child(3) {
                color: #b3b3b3;
              } 
            }
          }
        
      }
    }
  }
  // .image-uploader {
  //   width: 500px;
  //   margin: 0 auto;
  // }
  // .audio-uploader {
  //   width: 800px;
  //   margin: 0 auto;
  // }
</style>