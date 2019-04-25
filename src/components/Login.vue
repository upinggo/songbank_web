<template>
    <modal name="loginModal" :height="'auto'" width="520">
      <div class="login-container">
        <div class="welcome"/>
        <div class="text-one">请登录牛班学员帐号</div>
        <div class="form">
          <FormGenerator :schema="schema" :model="model" :options="formOptions"></FormGenerator>
        </div>
        <div class="text-two">
          还不是牛班学员？<a href="#">点这里</a>
        </div>
      </div>
    </modal>
</template>
<script>
import VueFormGenerator from "vue-form-generator"
import "vue-form-generator/dist/vfg.css"
import { request, checkPhone } from '../utils.js'
let validators = VueFormGenerator.validators

export default {
  components: {
    FormGenerator: VueFormGenerator.component,
  },
  methods: {
    sendCode: function () {
      if(!checkPhone(this.model.phone)) {
        this.model.errMessage = "请输入正确的手机号码！"
        return false
      }
      request('member/index/getSmsCode', { phone: this.model.phone })
        .then(res => {
          if(!res.success) {
            this.model.errMessage = res.messages[0].message
            this.model.countDown = 0
          } else {
            this.smsSessionId = res.data.smsSessionId
          }
        })
      return true
    },
    onSubmit(e) {
      request('member/index/loginByPhone', { phone: this.model.phone,
                                              smsCode: this.model.smscode,
                                              smsSessionId: this.smsSessionId })
        .then(res => {
          if(res.success) {
            this.$store.commit('loginSuccess', res.data)
            this.$modal.hide('loginModal')
            if(!res.data.userverify)
              this.$modal.show('dialog', {
                      text: '您还没有实名认证，去实名认证么？',
                      buttons: [
                          {
                            title: '确定',
                            handler: () => {
                              this.$modal.hide('dialog')
                              this.$router.push('/pverify')
                            }
                          },
                          {
                            title: '取消',
                            handler: () => { this.$modal.hide('dialog') }
                          },
                      ],
              })
          } else this.model.errMessage = res.messages[0].message
      })
    },
  },
  watch: {
    errMessage: function (val) {
      
    }
  },
  data () {
    return {
      smsSessionId: '',
      model: {
        errMessage:'',
        phone: '',
        smscode: '',
        countDown: 0,
        countDownSet: null,
      },
      schema: {
        fields: [
          {
            type: 'input',
            inputType: 'text',
            model: 'phone',
            placeholder: '请输您的手机号码',
            min: 11,
            max: 11,
            required: true,
            validator: function (val) {
              if(!checkPhone(val)) return ['手机号码输入不正确']
              else return []
            }
          },
          {
            type: 'input',
            inputType: 'text',
            model: 'smscode',
            placeholder: '请输入您的验证码',
            min: 4,
            max: 4,
            required: true,
            validator: validators.string.locale({
              fieldIsRequired: "验证码不能为空!",
              textTooSmall: "验证码错误",
              textTooBig: "验证码错误"
            }),
            buttons: [
              {
                classes: "btn-code form-control",
                label: '发送验证码',
                onclick: (model,filed) => {
                  if(!this.sendCode()) return
                  model.countDown = 60;
                  if(model.countDownSet)clearInterval(model.countDownSet)
                  let button = filed.buttons[0]
                  button.label= model.countDown + "秒"
                  button.classes= "btn-code-disbale form-control"
                  model.countDownSet = setInterval(function(){
                    model.countDown--
                    if(model.countDown > 0) {
                      button.label= model.countDown + "秒"
                    }
                    else {
                      clearInterval(model.countDownSet)
                      model.countDownSet = null
                      button.classes= "btn-code form-control"
                      button.label= "发送验证码"
                    }
                  }, 1000)

                },
              }
            ],
          },
          {
            type: "label",
            model: "errMessage",
            styleClasses: "err-message"
          },
          {
            type: "submit",
            buttonText: "登录",
            validateBeforeSubmit: true,
            onSubmit:this.onSubmit,
            styleClasses: "from-submit"
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
 .login-container{
   padding: 60px 60px 110px;
   color: #333333;
   .welcome {
     width: 400px;
     height: 40px;
     background: url('../assets/icons/welcome.png') center/contain no-repeat;
   }
   .text-one {
     margin-top: 40px;
     font-size: 18px;
   }
   .text-two {
     margin-top: 24px;
     font-size: 14px;
     color: #666;
     a {
       color: #40D77E;
     }
   }
   .form {
     .form-group {
      margin-top: 24px;
      height: 40px;
     }
     .form-control {
      height: 40px;
      font-size: 16px;
      line-height: 24px;
      padding: 8px 12px;
     }

     .btn-code {
       width: 120px;
       outline: none;
     }
     .btn-code-disbale {
       width: 120px;
       opacity: .5;
       pointer-events: none;
       outline: none;
     }
     .err-message {
       margin-top: 0;
       margin-bottom: 0;
       height: 30px;
       line-height: 30px;
       color:#E76C7B;
     }
     .from-submit
     { 
       margin-top: 0;
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


