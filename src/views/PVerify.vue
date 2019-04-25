<template>
  <div class="pv-container">
    <div class="pv-header">
      <div>实名认证</div><!--<a href="javascript:history.back(-1)">返回</a>-->
    </div>
    <div class="form">
      <FormGenerator :schema="schema" :model="model" :options="formOptions"></FormGenerator>
    </div>
  </div>
</template>
<script>
import VueFormGenerator from "vue-form-generator"
import "vue-form-generator/dist/vfg.css"
import * as qiniu from 'qiniu-js'
import { request, dataURLtoBlob } from '../utils.js'


let validators = VueFormGenerator.validators
const _this = this
export default {
  name: "pVerify",
  data() {
    return {
      facekey:'',
      faceuploading: false,
      backkey:'',
      backuploading: false,
      model: {
        upText: '1.根据国家相关规定，请提供有效身份的彩色照片/彩色扫描件  2.图片必须为jpg、jpeg、png格式、且大小<3M',
        certificate: 1,
        face: '',
        back: '',
        name: '',
        code: '',
      },
      schema: {
        fields: [
          {
            type: 'select',
            label: "证件类型:",
            model: 'certificate',
            required: true,
            values: [
              {id: 1, name: '身份证'},
              {id: 2, name: '护照'},
            ],
            onChanged: (model, newVal) => {
              
            },
            styleClasses: "from-certificate"
          },
          {
              type: "label",
              label: "上传证件照:",
              model: "upText",
              styleClasses: "from-upText",
          },
          {
              type: "image",
              label: "",
              model: "face",
              required: true,
              preview: true,
              hideInput: true,
              styleClasses: "from-img from-face",
              validator: validators.string.locale({
                fieldIsRequired: "请上传证件照正面!",
              }),
              onChanged: (model, newVal) => {
                if(!/^data:image\/(png|jpg|jpeg)/.test(newVal) || this.faceuploading)
                {
                  model.face = ''
                  this.$modal.show('dialog', {
                      text: '上传中。',
                      buttons: [
                          {
                            title: '关闭'
                          }
                      ]
                    })
                  return
                }
                this.faceuploading = true
                this.uploadToQiniu(newVal, model.certificate, 'face')
                
              }
          },
          {
              type: "image",
              label: "",
              model: "back",
              required: true,
              preview: true,
              hideInput: true,
              visible: (model) => { 
                    if(model.certificate === 1) { return true; } 
                    return false; 
              },
              styleClasses: "from-img from-back",
              validator: validators.string.locale({
                fieldIsRequired: "请上传证件照背面!",
              }),
              onChanged: (model, newVal) => {
                if(!/^data:image\/(png|jpg|jpeg)/.test(newVal) || this.backuploading)
                {
                  model.face = ''
                  this.$modal.show('dialog', {
                      text: '上传中。',
                      buttons: [
                          {
                            title: '关闭'
                          }
                      ]
                    })
                  return
                }
                this.backuploading = true
                this.uploadToQiniu(newVal, model.certificate, 'back')
                
              }
          },
          {
              type: "label",
              label: "姓名:",
              model: "name",
              required: true,
              visible: (model) => { 
                    if(model.name) { return true; } 
                    return false; 
              },
              required: true,
              validator: validators.string.locale({
                fieldIsRequired: "用户名无法识别，请重新上传!",
              }),
          },
          {
              type: "label",
              label: "证件号码:",
              model: "code",
              required: true,
              visible: (model) => { 
                    if(model.code) { return true; } 
                    return false; 
              },
              required: true,
              validator: validators.string.locale({
                fieldIsRequired: "证件号码无法识别，请重新上传!",
              }),
          },
          {
            type: "submit",
            buttonText: "保存提交",
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
  },
  components: {
    FormGenerator: VueFormGenerator.component,
  },
  methods: {
    onSubmit(e) {
      request('member/user/approve', {
        type: this.model.certificate,
        face: this.facekey,
        back: this.backkey,
        name: this.model.name,
        num: this.model.code,
      })
        .then(res => {
          if(res.success) {
            this.$router.go(-1)
          }
          else {
            this.$modal.show('dialog', {
                      text: '提交失败，请重试。',
                      buttons: [
                          {
                            title: '关闭'
                          }
                      ]
                    })
          }
      })
    },
    uploadToQiniu(data, type, side) {
      request('member/qiniu/token', {type: 'idcard'}).then(res => {
          if(!res.success) {
            this.resetUploading(side)
            this.$modal.show('dialog', {
                      text: '上传失败，请重试。',
                      buttons: [
                          {
                            title: '关闭'
                          }
                      ]
                    })
            return 
          }
          let observable = qiniu.upload(
            dataURLtoBlob(data),
            null,
            res.data.uptoken,
            {
              fname: '',
              params: {},
              mimeType: null
            },
            {
              useCdnDomain: true,
              disableStatisticsReport: false,
              retryCount: 3,
            })
          let subscription = observable.subscribe({
            next: (res)=>{},
            error: (err) =>{
              this.resetUploading(side)
              this.$modal.show('dialog', {
                      text: '上传失败，请重试。',
                      buttons: [
                          {
                            title: '关闭'
                          }
                      ]
                    })
            },
            complete: (res) => {
              let key = res.key
              request('member/user/verify',{type: type, file: key, side: side}).then(
                res => {
                  if(res.success)
                  {
                    console.log(res)
                    if(side === 'face') {
                      this.facekey = res.data.file
                      this.faceuploading= false
                      this.model.name = res.data.name
                      this.model.code = res.data.num
                    } else {
                      this.backkey = res.data.file
                      this.backuploading = false
                    }
                  }
                  else 
                  {
                    
                    this.resetUploading(side)
                    this.$modal.show('dialog', {
                      text: '请上传有效证件照片或复印件。',
                      buttons: [
                          {
                            title: '关闭'
                          }
                      ]
                    })
                  }
                }
              )


            },
          })
        })
    },
    resetUploading(side) {
      if(side === 'face') {
        this.facekey = ''
        this.faceuploading = false
        this.model.face = ''
        this.model.name = ''
        this.model.code = ''
      } else {
        this.model.back = ''
        this.backkey = ''
        this.backuploading = false
      }
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="less">
.pv-container {
  position: relative;
  width: 100%;
  .pv-header {
    width: 100%;
    border-bottom: 1px solid #D8D8D8;
    div {
      width: 1160px;
      margin: 0 auto;
      padding-top: 36px;
      padding-bottom: 22px;
      font-size: 16px;
      line-height: 22px;
      color: #000000;
      letter-spacing: 0.84px;
      text-align: left;
    }
    a {
      position: absolute;
      top: 36px;
    }

  }
  .form {
    width: 1160px;
    margin: 0 auto;
    padding: 60px 70px;
    box-sizing: border-box;
    font-size: 14px;
    .vue-form-generator {
      width: 440px;
      .form-group {
        >label {
          display: inline-block;
          width: 84px;
          text-align: right;
          vertical-align: top;
          span {
            margin-left: unset;
            
          }
          &::after {
            content: '';
          }
        }
        .field-wrap {
          display: inline-block;
          width: 330px;
          margin-left: 10px;
          text-align: left;

          .form-control {
            width: 256px;
          }
          span {
            margin-left: unset;
          }
        }
        .errors {
          span {
            background-image: unset;
          }
        }
      }
    }
    .from-certificate {
      .form-control {
        width: 256px;
        height: 32px;
        line-height: 32px;
      }
    }
    .from-upText {
      .field-wrap {
        font-size: 12px;
        color: #999;
        line-height: 2;
      }
    }
    .from-img {
      .field-wrap {
        position: relative;
        &:hover::after {
          top: 5px;
          background: url('../assets/icons/img-upload.png') center/auto no-repeat #00000085;
        }
        .file {
          position: absolute;
          width: 256px;
          height: 173px;
          opacity: 0;
          z-index: 1;
        }
        .preview {

          width: 256px;
          height: 173px;
          border: 1px dashed #D9D9D9;
          border-radius: 5.89px;
          .remove {
            display: none;
          }
        }
      }
    }
    .from-face {
      .field-wrap {
        &::after {
            position: absolute;
            top: 0;
            content: '';
            display: block;
            width: 256px;
            height: 173px;
            background: url('../assets/icons/p-face.png') center/auto no-repeat;
        }
      }
    }
    .from-back {
      .field-wrap {
        &::after {
            position: absolute;
            top: 0;
            content: '';
            display: block;
            width: 256px;
            height: 173px;
            background: url('../assets/icons/p-back.png') center/auto no-repeat;
        }
      }
    }

     .form-submit .field-wrap{
       text-align: center !important;
       input {
        width: 50%;
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