<template>
  <div class="wrapper select-input">
      <div class="checkbox"><input type="checkbox" v-model="value.my"/><span>本人</span></div>
      <div v-if="value.my" class="u-name">{{value.myName}}</div>
      <div class="checkbox"><input type="checkbox" v-model="value.others"/><span>合作</span></div>
      <ul v-if="value.others" class="others">
        <li v-for="(item, idx) in value.othersList"  :key="idx"><div class="u-name">{{item}}</div><i @click="onRemoveOther(idx)"/><span>点击移除合作者</span></li>
      </ul>
      <div v-if="value.others" class="add-other">
        <input class="u-name" v-model="addinput" maxlength="20" placeholder="请输入一位合作者姓名"> <i @click="onAddOther"/><span>点击添加合作者</span>
      </div>
  </div>
  
</template>
<script>
import { abstractField } from "vue-form-generator";
import { debounce, get as objGet, isFunction, isNumber } from "lodash";
import fecha from "fecha";

export default {
  mixins: [abstractField],
  data () {
    return {
      addinput: '',
    }
  },
  computed: {
  },
  methods: {
    onAddOther() {
      if(!this.addinput.length) return
      this.value.othersList.push(this.addinput)
      this.addinput = ''
    },
    onRemoveOther(idx) {
      if(idx < this.value.othersList.length) this.value.othersList.splice(idx, 1)
    }
  }
  
}
</script>
<style lang="less" scoped>
  .select-input {
    .checkbox {
      margin-top: 12px;
      span {
        margin-left: 10px;
        font-size: 14px;
        color: #666666;
      }
    }
    .u-name {
      display: inline-block;
      margin-top: 10px;
      width: 290px;
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
      background: #fff;
      border: 1px solid #F0F0F0;
      border-radius: 4px;
    }
    .others, .add-other {
      i {
        display: inline-block;
        margin-left: 10px;
        width: 24px;
        height: 24px;
        vertical-align: text-bottom;
        cursor: pointer;
        background:url("../../assets/icons/reduce.png") center/cover no-repeat;
      }
      span {
        height: 24px;
        margin-left: 10px;
        font-size: 10px;
        color: #B3B3B3;
        line-height: 24px;
      }
    }
    .add-other {

      i {
        background:url("../../assets/icons/add.png") center/cover no-repeat;
      }
    }
  }
</style>


