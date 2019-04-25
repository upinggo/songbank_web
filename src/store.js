import Vue from 'vue'
import Vuex from 'vuex'
import { userInfo, loginSuccessed, logout } from './utils.js'
import pIcon from './assets/icons/p-icon.png'


Vue.use(Vuex)
const initUserInfo = {
  islogin: false,
  id: '',
  name: '',
  icon: pIcon,
  iconColor: '',
  cover: '',
  coverColor: '',
  mewMessage: false,
  token: '',
  gender: 0,
  school: '',
  course: '',
  isstudy: 0,
  achievement: '',
  verify: 0,
}
export default new Vuex.Store({
  state: {
    userInfo: userInfo ? userInfo : initUserInfo,
    beats:{
      categories:{},
      list:[]
    },
    songInfo: {
      curIndex: 0,
      playing: false,
      progress: 0,
      list: [],
    },
    home: {
      list: [],
    },
    current:{
      list:[]
    }
  },
  mutations: {
    setBeatsCategories(state,categories){
      state.beats.categories=categories
    },
    setBeatsList(state,list){
state.beats.list=list;
    },
    loginSuccess(state, userInfo) {
      state.userInfo = {...state.userInfo,
        islogin: true,
        name: userInfo.userfullname,
        id: userInfo.userid,
        icon: userInfo.useravatarurl ? userInfo.useravatarurl : pIcon ,
        iconColor: userInfo.useravatarcolor ? userInfo.useravatarcolor : '#9E606B',
        cover: userInfo.usercoverurl,
        coverColor: userInfo.usercovercolor,
        token: userInfo.token,
        gender: userInfo.usergender,
        school: userInfo.userschool,
        course: userInfo.usercourse,
        isstudy: userInfo.userisstudy,
        achievement: userInfo.userachievement,
        verify: userInfo.userverify,
      }

      loginSuccessed(state.userInfo)
    },
    logoutSuccess(state){
      state.userInfo = initUserInfo
      logout()
    },
    setHomeList(state, songList) {
      state.home.list = songList
    },
    setCurrentList(state, songList) {
      state.current.list = songList
    },
    
    setSongList(state, songList, curIndex=0) {
      const { songInfo } = state
      songInfo.list = songList && songList.length ? songList.map(song => {
        return {...song,
          title: song.wksongname?song.wksongname:'未定义',
          artist: song.wkwriter?song.wkwriter:'未定义',
          src: song.wksongurl?song.wksongurl:song.btsurl?song.btsurl:'未定义',
          pic: song.wkcoverurl?song.wkcoverurl:'未定义'
        }
      }) : [];
      songInfo.curIndex = curIndex
    },
    updatePlaying(state, playing) {
      if (state.songInfo.playing !== playing)
        state.songInfo.playing = playing
    },
    updateSongIndex(state, songIndex) {
      state.songInfo.curIndex = songIndex

    },
    updateProgress(state, progress) {
      state.songInfo.progress = progress
    },
    toggleSong(state, songIndex) {
      const { songInfo } = state
      if (songIndex > -1 && songIndex < songInfo.list.length)
      {
        if (songInfo.curIndex === songIndex) songInfo.playing = !songInfo.playing
        else {
          songInfo.playing = true
          songInfo.curIndex = songIndex
          //songInfo.progress = 0
        }
      }
    },
  },
  actions: {
    
  }
})
