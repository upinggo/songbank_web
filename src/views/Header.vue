<template>
  <div class="header-container clearfix">
    <div class="header">
      <div class="logo">

      </div>
      <div v-if="$store.state.userInfo.islogin" class="uinfo">
        <router-link to="/message"><i :class="$store.state.userInfo.mewMessage ? 'new-message' : 'no-message'" /></router-link>
        <router-link to="/phome"><img class="icon" :src="$store.state.userInfo.icon" />{{$store.state.userInfo.name}}</router-link>
      </div>
      <div v-else class="uinfo" @click="$modal.show('loginModal')"><span>登录</span></div>
      <div class="plink">
        <router-link to="/">首页</router-link>
        <router-link to="/current">本期活动</router-link>
        <router-link to="/beats">beats库</router-link>
      </div>
    </div>
  </div>
</template>
<script>

import { request } from '../utils.js'

export default {
  methods: {

  }
}
</script>
<style lang="less">
  .header-container {
    width: 100%;
    height: 80px;
    line-height: 80px;
    background-color: #000;
    z-index: 900;
    .header {
      width: 1060px;
      margin: 0 auto;
      color: #fff;
      font-size: 18px;
      .logo {
        float: left;
      }
      .plink {
        float: right;
        a {
          display: inline-block;
          margin-right: 40px;
          height: 100%;
          opacity: 0.8;
          &.router-link-exact-active {
            opacity: 1;
            line-height: 77px;
            font-weight: bold;
            border-bottom: 3px solid #7DFF32;
          }
        }
      }
      .uinfo {
        float: right;
        a {
          margin-right: 18px;
          .icon {
            margin-right: 8px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            vertical-align: text-top;
          }
        }
        i {
          height: 20px;
          width: 20px;
          display: inline-block;
          background-color: #fff;
          vertical-align: sub;
          &.new-message {
            background: url("../assets/icons/new-message.png") center/contain no-repeat;
          }
          &.no-message {
            background: url("../assets/icons/no-message.png") center/contain no-repeat;
          }
        }
        span {
          display: inline-block;
          cursor: pointer;
          color: #b3b3b3;
        }
      }
    }
  }
</style>