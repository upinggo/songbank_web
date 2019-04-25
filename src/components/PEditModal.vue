<template>
    <modal name="pEditModal" :height="'auto'" width="500">
      <div class="edit-container">
        <div class="edit-title">
          编辑你的个人资料 <i @click="$modal.hide('pEditModal')" class="close-btn"/>
        </div>
        <div class="form">
          <FormGenerator :schema="schema" :model="model" :options="formOptions"></FormGenerator>
        </div>
      </div>
    </modal>
</template>
<script>
import VueFormGenerator from "vue-form-generator"
import "vue-form-generator/dist/vfg.css"
import { request } from '../utils.js'
let validators = VueFormGenerator.validators

export default {
  props: {
    info: Object,
  },
  components: {
    FormGenerator: VueFormGenerator.component,
  },
  methods: {
    onSubmit(e) {
      request('member/user/updateUser', this.model)
        .then(res => {
          if(res.success) {
            
          }
      })
    },
  },
  watch: {
    errMessage: function (val) {
      
    }
  },
  data () {
    return {
      model: {
        userfullname: this.info.name,
        usergender: this.info.gender,
        userschool: this.info.school,
        usercourse: this.info.course,
        userisstudy: this.info.isstudy,
        userachievement: this.info.achievement,
      },
      schema: {
        fields: [
          {
            type: 'input',
            inputType: 'text',
            label: '你的昵称',
            model: 'userfullname',
            placeholder: '请输入',
            max: 20,
            required: true,
            validator: validators.string.locale({
              fieldIsRequired: "昵称不能为空!",
              textTooBig: "长度不能超过 {1} 个字符"
            }),
          },
          {
            type: 'radios',
            label: '性别',
            model: 'usergender',
            values: [
              { name: "男", value:1 },
              { name: "女", value:2 },
            ],
            styleClasses: "form-radios"

          },
          {
            type: 'input',
            inputType: 'text',
            label: '所在校区',
            model: 'userschool',
            placeholder: '请输入',
            max: 10,
            validator: validators.string.locale({
              textTooBig: "长度不能超过 {1} 个字符"
            }),
          },
          {
            type: "checklist",
            label: "参与课程（多选）",
            model: "usercourse",
            listBox: true,
            values: [
              { value: "vocal", name: "声乐"},
              { value: "piano", name: "键盘"},
              { value: "guitar", name: "吉他"},
              { value: "composition", name: "编曲"},
              { value: "master", name: "大师创作营"},
            ],
            styleClasses: "form-checklist"
          },
          {
            type: 'radios',
            label: '学习状态',
            model: 'userisstudy',
            values: [
              { name: "正在学习", value:1 },
              { name: "已结业", value:2 },
              { name: "我是老师", value:3 },
            ],
            styleClasses: "form-radios"

          },
          {
            type: "textArea",
            label: "个人简介/乐队简介",
            model: "userachievement",
            hint: "最多200字",
            max: 200,
            placeholder: "一句话向全世界介绍你自己",
            rows: 3,
            validator: validators.string.locale({
              textTooBig: "长度不能超过 {1} 个字符"
            }),
            styleClasses: "form-textArea"
          },
          {
            type: "submit",
            buttonText: "提交",
            validateBeforeSubmit: true,
            onSubmit:this.onSubmit,
            styleClasses: "form-submit"
          }
        ]
      },
      formOptions: {
        validateAfterChanged: true,
        validateAsync: true
      }
    }
  }
  
}
</script>
<style lang="less">
 .edit-container{
   display: flex;
   flex-flow: column;
   max-height: 100%;
   .edit-title {
     height: 50px;
     padding: 10px 30px;
     font-size: 20px;
     line-height: 30px;
     color: #000;
     border-bottom: 1px solid #D8D8D8;
     box-sizing: border-box;
     .close-btn {
       display: inline-block;
       width: 30px;
       height: 30px;
       float: right;
       background: url("../assets/icons/close-circle.png") center center/cover no-repeat;
       vertical-align: text-bottom;
       cursor: pointer;
     }
   }
   .form {
     padding: 10px 50px;
     color: #666;
     placeholder {
       color: #b3b3b3;
     }
     overflow-y: scroll;
     .form-control {
        height: 34px;
        margin-top: 10px;
      }
      .form-textArea .form-control{
        height: inherit;
        width: 100% !important;
      }
      .form-checklist .form-control{
        height: inherit;
        width: 100% !important;
        padding: unset;
        border: none;
        box-shadow: none;
        .list-row {
          display: inline-block;
          input {
            display: none;
          }
          label {
            display: block;
            padding: 0 12px;
            margin-left: 10px;
            height: 32px;
            border: 1px solid #40D77E;
            border-radius: 4px;
            color:#40D77E;
            line-height: 32px;
          }
          &.is-checked {
            label {
              background: #40D77E;
              color: #fff;
            }
          }
        }
      }
     .form-radios {
       .radio-list{
          margin-top: 10px;
          font-size: 14px;
          label {
            display: inline-block;
            margin-right: 20px;
          }
        }
     }
     .form-submit {
       input {
        width: 100%;
        height: 40px;
        font-size: 16px;
        line-height: 24px;
        padding: 8px 12px;
        background: #40D77E !important;
        border: none;
        outline: none;
        color: #fff;
      }
     }
   }
 }

</style>