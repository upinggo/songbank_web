<template>
  <div class="message">
    <h1 class="title">我的消息</h1>
    <hr>
    <table>
        
        <tr  v-if='this.message&&this.message.length!=0'>
            <th>主题</th>
            <th>来自</th>
            <th>时间</th>
            <th>操作</th>
        </tr>
        <tr v-else :class='{no:!this.message||this.message.length==0}'>
            <img src="../assets/nomessage.png" alt="">
            <p>暂无消息</p>
        </tr>
        <tr :class="{readed:item.msgreadtime!==0}" v-for="(item,index) in this.message" :key="index">
            <td>{{item.msgtitle}}</td>
            <td>系统</td>
            <td>{{new Date(item.msgaddtime*1000).getFullYear()+'-'+(new Date(item.msgaddtime*1000).getMonth()+1)+'-'+new Date(item.msgaddtime*1000).getDate()}}</td>
            <td><span @click='look(item.msgid,index)'>查看</span>|<span @click="del(index,item.msgid)">删除</span></td>
        </tr>
    </table>
    <Modal
            ref="Modal"
            :mtitle="time"
            v-show="isModalVisible"
            statusText="我的消息"
            @closeModal="closeModal"
            :contentText="text"
            @button="confirm"
            alert='1'
        >
        </Modal>

  </div>
</template>

<script>
import { request } from '../utils.js'
import Modal from '@/components/Modal.vue'
export default {
  name: "message",
  components: {
      Modal
  },
  data () {
    return {
      message: [],
       
       isModalVisible:false,           
        show: false,            
        showToast: false,            
        thisIndex:0,            
        green:'green',            
                time:"",   
         text:{}    

    }
  },
  methods: {
        closeModal($event){            this.isModalVisible = false;
         
        },
        confirm(){           this.isModalVisible = false;
        },

      look(id,index){
          console.log(this,this.$parent);
        this.isModalVisible = true;            
        //   this.blue = this.$refs.Model.blue            
          
request('member/message/read',{msgid:id}).then(
            res=>{
          if(res.success)
            {   
                var item=res.data;
                
                this.time=new Date(item.msgaddtime*1000).getFullYear()+'-'+(new Date(item.msgaddtime*1000).getMonth()+1)+'-'+new Date(item.msgaddtime*1000).getDate()
                this.text=res.data
                this.message[index]=res.data;}
      }
          )
      },
      del(index,id){
          request('member/message/delete',{msgid:id}).then(
            res=>{
          if(res.success)
            {this.message.splice(index,1)}
      }
          )
          
          
      }
  },
  created: function () {
      request('member/message/myMessages',{}).then(res=>{
          if(res.success)
          this.message=res.data
      })
  }
};
</script>
<style lang="less">
  .message{
      padding:100px;
      .title{
          text-align:left;
          font-size:30px;
          padding-bottom:10px;
      }
      table{
          width:100%;
          tr:nth-child(1):not(.no){
              background-color:grey;
              line-height:60px;
              th:nth-child(1){
                  text-align:left;
                  padding-left:30px;
              }
          }
          tr.no{
              img{
                  margin: 30px auto 0;
              }
              margin: 40px auto;
              line-height: auto;
            //   background-color:white!important;
          }
          tr{
              line-height:40px;
              td:nth-child(1){
                  &:before{
                      content:'';
                      display:inline-block;
                    //   width:3px;
                    //   height:3px;
                      border-radius:50%;
                      border:solid 3px red;
                  }
                  
                  text-align:left;
                  padding-left:30px;
              }
              td:last-child{
                  color:green;
                  span{
                      padding:0 10px;
                  }
              }
              &.readed{
                  td:before{
                      display:none;
                  }
                  td:last-child{
                  color:grey;
                  
              }
                  color:grey;
                  opacity:0.3;
              }
          }
      }
  }
</style>