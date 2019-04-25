<template>
  <div class="beats">
    <div class="top-banner">
      <img src="../assets/beats-banner.png"/>
      <button ><p><img src="../assets/beats-btn.png" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;怎么玩</p></button>
    </div>
    <div class="sub-banner">
      <p style='line-height:140px;font-family: PingFangSC-Medium;color: #000000;letter-spacing: 0.8px;font-size:32px;'>什么是Beats创作？<button ><p><img src="../assets/pointing-right.png" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 5分钟教学</p></button></p>
    
    </div>
    <div class="description">
      Beats可以为创作者提供灵感，快速创作出好的词曲，经过复制、粘贴、剪辑等手法做成简<br/>单的伴奏带，也可再进行后续的精心修改及重新编曲，适用于所有创作者。
      <div class='show-icon'>
            <div class="icon icon1">
            选择你喜欢的Beats
            </div>
            <div class="icon icon2">
           下载到你的电脑中
            </div>
            <div class="icon icon3">
            开始你的创作
            </div>
            
      </div>
    </div>
    
    <div v-if='$store.state.userInfo.islogin' class='detail-cantiner'>
      <div class="title"><img src="../assets/beats_title.png" alt=""></div>
    <div class="search-bar">
    <span :class='{hasbg:beatsindex==index}' v-for="(item, index) in this.$store.state.beats.categories" :key="'beats-'+index" @click='changecategories(item.bcid,index)'>{{item.bcname}}</span>
        <span>///&nbsp;&nbsp;&nbsp;&nbsp;选喜欢的曲风 开始你的创作&nbsp;&nbsp;&nbsp;&nbsp;///</span>
        
      </div>
      <ul v-if='beatsindex!=null' class="song-list">
        <li>
          
          <span>序号</span>
          <span>Tempo</span>
          <span>Key</span>
          <span>风格</span>
          <span>播放</span>
          <span>下载</span>
          
        </li>
        <li v-for="(item, index) in this.$store.state.beats.list" :key="index" :class="$store.state.songInfo.curIndex === index && $store.state.songInfo.playing ? 'li-bg': 'li-no-bg'">
          <img v-if='$store.state.songInfo.curIndex === index && $store.state.songInfo.playing' src='../assets/beats.png'>
          <div  class="song-info">
           <span>{{item.btsid}}</span>
           <span>{{item.btstempo}}</span>
            <span>{{item.btskey}}</span>
            <span>{{item.btsseq}}</span>
            <span @click="onPlaySong(index)" ><img v-if='$store.state.songInfo.curIndex !== index || !$store.state.songInfo.playing' src='../assets/beats_start.png'/><img v-else src='../assets/beats_pause.png'/></span>
            <span @click="download(item.btsid)"><img src='../assets/beats_load.png'/></span>
            
          </div>
        </li>
      </ul>
    </div>
    <div v-else>请先登录，查看beats库</div>
  </div>
</template>

<script>
import {request,apiUrl} from '../utils'
// import apiUrl from '../utils'
// @ is an alias to /src
export default {
  name: "beats",
  components: {
    
  },
  data () {
    return {
      beats:1,
      beatsindex:null
    }
  },
  methods: {
    download(id){
      var xmlResquest  = new XMLHttpRequest();
      xmlResquest.open('POST',apiUrl+'member/beats/download',true);
      xmlResquest.setRequestHeader("Content-type", "application/json");
      xmlResquest.setRequestHeader('token',JSON.parse(localStorage.getItem('userInfo')).token)
      xmlResquest.responseType = "blob";
      xmlResquest.onreadystatechange=function(){
       if(xmlResquest.readyState==3){
// console.log(xmlResquest.getAllResponseHeaders())
       } 
      }
	    xmlResquest.onload = function (oEvent) {
      
	    var content = xmlResquest.response;
	    var elink = document.createElement('a');
	    elink.download = `beats-${id}.mp3`;
	    elink.style.display = 'none';
      var blob = new Blob([content]);
      console.log(blob)
	    elink.href = URL.createObjectURL(blob);
	    document.body.appendChild(elink);
	     elink.click();
	    document.body.removeChild(elink);
	    };
	     xmlResquest.send(JSON.stringify({btsid:id}));



    },
    // onSearch () {
    //   if(this.searchKey)
    //     this.$router.push({name: 'search', params: {key: this.searchKey}})
    // },
   changecategories(id,index){
     let { beats } = this.$store.state
     let self=this;
     request('/member/beats/search', {btsbcid:id, })
          .then(res => {
            if(res.success) {  
              // console.log(res)
              self.beatsindex=index;
              beats.list=beats.list
              this.$store.commit('setBeatsList', res.data)
              this.$store.commit('setSongList', beats.list);
            }
          })
   },
    onGoPhome (index) {
      this.$router.push({name:'phome', params: {key: index}})
    },
    
    onPlaySong (index) {
      this.$store.commit('toggleSong', index)
    },
    changerouter(){
 var type=this.$route.params.type;
    this.type=type;
    },
    handleScroll(){
     var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    var offsetTop = document.querySelector('.search-bar').offsetTop;
    // console.log(offsetTop,scrollTop)
if(scrollTop>=1650){
  document.querySelector('.search-bar').classList='search-bar fixed'
  
}
else{
  document.querySelector('.search-bar').classList='search-bar'
}

    }
  }, watch: {
            '$route': 'changerouter'
        },
  created: function () {
     let { beats } = this.$store.state
    
      request('/member/beats/categories', { })
          .then(res => {
            if(res.success) {
              this.$store.commit('setBeatsCategories', res.data)
              
             
            }
          })
   
  },

  mounted() {
   window.addEventListener('scroll',this.handleScroll)
  },
  destroyed(){
    window.removeEventListener('scroll',this.handleScroll)
  }
};
</script>
<style lang="less" scoped>

.li-bg{
  padding:10px;
  margin-bottom: 20px!important;
  span{
color:black!important;
  }
  
}
.li-no-bg{
  padding:10px;
  margin-bottom: 20px!important;
  span{
  color:white!important;
  }
}

  .beats {
    width: 1440px;
    margin: 0 auto;
    .detail-cantiner{
      padding:0 100px;
      ul.song-list{
        background-image: linear-gradient(44deg, #7A169B 0%, #263EFF 47%, #88FF3B 100%);
border-radius: 12px;
        padding:0px 0 80px;
        box-sizing:border-box;
-moz-box-sizing:border-box; /* Firefox */
-webkit-box-sizing:border-box; /* Safari */
        margin:0 auto;
        width: 80%;
        text-align:left;
        color:white;
        li{background:none;
        position:relative;
        width:80%;
        margin:0 auto;
        border-bottom: 1px solid grey;
          &:first-child{
            padding:30px 15px;
            margin-bottom: 0;
            // padding:10px;
            border-bottom:white 2px solid;
            &:hover{
              cursor: inherit;
              background:none;
            }
          }
         &>img{
           position:absolute;
           top:45%;left:10px;
           width:20px;
           height:20px;
         }
          span{
            flex:1;
          }
         
          display:flex;
          justify-content:center;
          
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
        font-weight: 600;
        font-size: 30px;
        margin: 20px auto 0;

      }
      .search-bar{
        padding:40px 0 80px;
        display:flex;
        flex-wrap:  wrap ;
        justify-content:space-between;
        margin:0 auto;
        width: 80%;
        text-align:left;
        &.fixed{
          top:80px;
          padding:30px 100px;
          box-sizing: border-box;
  left :0;
  width:100%;
  margin: 0 auto;
  right: 0;
   position:fixed;
   background-color: rgba(0,0,0,0.8);
   z-index: 3;
        }
        span:last-child{
          background-image: linear-gradient(to left,#CB52F3, #4D61FF,#88FF3B);
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
          
          color:green;
          border:none;
          &:hover{
            cursor:none;
          // background:none;

          }
        }
        .swork{
          position: relative;
          width: 450px;
          right:0;
          border-bottom: 1px solid  #FFFFFF;
        }
        span{
          max-width: 50%;
          min-width: 20%;
          text-align: center;
          &.hasbg{
  background: linear-gradient(to left, #65149A,#2651FF, #88FF3B);
}
        padding:10px;
        border:1px solid ;
          border-image: linear-gradient(to left, #65149A,#2651FF, #88FF3B);
  border-image-slice: 1;
        margin:10px 0;
        &:hover:not(:last-child){
          cursor: pointer;
         background: linear-gradient(to left, #65149A,#2651FF, #88FF3B);
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
      button{
       border:0;
       cursor: pointer;
       p{
         position: relative;
         
img{
  position: absolute;
          top:50%;
          left:35%;
          transform:translate(-50%,-50%);
          height:28px;
          width:40px;
        }
       }
        
        font-weight:700;
        position:absolute;
        width:240px;
        bottom:202px;
        margin: 0 auto;
        left:0;
        right:0;
        line-height:62px;
        height:62px;
        background-image: linear-gradient(-135deg, #B4FF61 0%, #7DFF32 100%);
border-radius: 7.75px;
      }
      position:relative;
      width: 100%;
      height: 760px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .sub-banner{
      button{
        border:0;
        p{
         position: relative;
         font-size: 18px;
img{
  position: absolute;
          top:50%;
          left:35%;
          transform:translate(-50%,-50%);
          width: 30px;
        }}
        cursor:pointer;
       padding:10px 2px;
       margin:0px 20px;
        color:white;
        width:13.9%;
        
        // line-height:62px;
        height:1.6%;
        background:#000;
      }
      width: 100%;
      height: 140px;
      background-image: linear-gradient(31deg, #7E32FF 0%, #70C8EC 49%, #88FF3B 100%);
      // img {
      //   width: 100%;
      //   height: 100%;
      // }
    }
    .description {
      color:grey;
      text-align:center;
      font-size: 18px;

      padding:90px 0;
      width: 100%;
      background: white;
      
      .show-icon{
        color:black;
        font-size: 14px;
      overflow:hidden;
      margin:0 auto;
      display:flex;
       justify-content:space-around;
        width:1000px;
        .icon{
          // width:130px;
          padding:0 50px;
          height:175px;
          line-height:300px;
          
        }
        .icon1{
          background:url("../assets/icons/1.png") center  no-repeat;
          background-size:75px 75px;
        }
        .icon2{
          background:url("../assets/icons/2.png") center no-repeat;
          background-size:75px 75px;
        }
        .icon3{
          background:url("../assets/icons/3.png") center no-repeat;
          background-size:75px 75px;
        }
       
    }
    }
    .top-cantiner {
      .text{
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
        width:80%;
        margin:0 auto -1px;
        padding:28px 0 0;
          a{
            flex:1;
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
          background: -moz-linear-gradient(left center,  #1C1966 100%, #F3A3C7 100%);
    background: -webkit-gradient(linear, left top, right bottom, from(#F3A3C7),to(#1C1966 ));
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1C1966', endColorstr='#F3A3C7',GradientType=1 );
    width:20%;
    // height:20%;
    line-height:48px;
    display:block;
    margin:0 auto;
    border-radius:5px;
    color:white;
   margin-bottom:120px;
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
                background: url('../assets/icons/play.png') center no-repeat;
                background-size:100%;
              }
              &.btn-pause {
                background-size:100%;
                background: url('../assets/icons/pause.png') center no-repeat;
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