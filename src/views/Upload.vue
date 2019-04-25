<template>
  <div class="upload-container">
    <div class="upload-title">
      <nav>
        <span @click="$router.push('/phome')">我的作品</span>
        <span>上传作品</span>
      </nav>
    </div>
    <div class="upload">
      <div class="audio-uploader">
        <AudioUploader @uploadComplete="onAudioUploaded"/>
      </div>
      <div class="gap"></div>
      <div v-if="audioKey" class="form-title">歌曲基本信息</div>
      <div v-if="audioKey" class="song-info">
        <div class="song-cover" @click="onCoverEdit">
          <img ref="coverimg" v-if="coverImg" :src="coverImg"/>
          <span>封面也是歌曲重要的一部分</span>
        </div>
        <div v-if="coverKey" class="form">
          <FormGenerator :schema="getschema" :model="model" :options="formOptions"></FormGenerator>
        </div>
      </div>
      <modal name="coverEditer" :height="'auto'">
        <div class="coverEditer">
          <ImageUploader @uploadComplete="onCoverUploaded"/>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
import VueFormGenerator from "vue-form-generator"
import "vue-form-generator/dist/vfg.css"
import ImageUploader from "@/components/imageUploader/ImageUploader.vue"
import AudioUploader from "@/components/AudioUploader.vue"
import { request } from '../utils.js'

let validators = VueFormGenerator.validators
export default {
  name: "upload",
  components: {
    ImageUploader,
    AudioUploader,
    FormGenerator: VueFormGenerator.component,
  },
  data() {
    const _this = this
    return {
      songid: 0,
      audioKey: '',
      audioDuration: 0,
      coverKey: '',
      coverColor: '',
      coverImg: '',
      beats:{},
      model: {
        songName: '',
        singer: {
          my: false,
          myName: this.$store.state.userInfo.name,
          others: false,
          othersList: [],
        },
        textauthor: {
          my: false,
          myName: this.$store.state.userInfo.name,
          others: false,
          othersList: [],
        },
        songauthor: {
          my: false,
          myName: this.$store.state.userInfo.name,
          others: false,
          othersList: [],
        },
        styleauthor: {
          my: false,
          myName: this.$store.state.userInfo.name,
          others: false,
          othersList: [],
        },
        teacher: '',
        masterteacher: '',
        fromBeats: 1,
        beatsType: null,
        beatsId: null,
        subjectId: null,
        songintroduce: '',
        open: 1,
      },
      schema: {
        fields: [
          {
            type: 'input',
            inputType: 'text',
            label: '歌名',
            model: 'songName',
            placeholder: '请输入歌名',
            max: 20,
            required: true,
            validator: validators.string.locale({
              fieldIsRequired: "歌名不能为空!",
              textTooBig: "长度不能超过 {1} 个字符"
            })
          },
          {
            type: "selectInput",
            label: "歌手(可以多选)",
            model: "singer",
            required: true,
            validator: function (val) {
              if(!(val.my || (val.others && val.othersList.length))) return ['歌手不能为空！']
              else return []
            }
          },
          {
            type: 'selectInput',
            label: '作词(可以多选)',
            model: 'textauthor',
            required: true,
            validator: function (val) {
              if(!(val.my || (val.others && val.othersList.length))) return ['作词不能为空！']
              else return []
            }
          },
          {
            type: 'selectInput',
            label: '作曲(可以多选)',
            model: 'songauthor',
            required: true,
            validator: function (val) {
              if(!(val.my || (val.others && val.othersList.length))) return ['作曲不能为空！']
              else return []
            }
          },
          {
            type: 'selectInput',
            label: '编曲(可以多选)',
            model: 'styleauthor',
            required: true,
            validator: function (val) {
              if(!(val.my || (val.others && val.othersList.length))) return ['编曲不能为空！']
              else return []
            }
          },
          {
            type: 'input',
            inputType: 'text',
            label: '校内辅导老师',
            model: 'teacher',
            placeholder: '请输入校内辅导老师',
            max: 10,
            validator: validators.string.locale({
              textTooBig: "长度不能超过 {1} 个字符"
            })
          },
          {
            type: 'input',
            inputType: 'text',
            label: '大师课导师',
            model: 'masterteacher',
            placeholder: '请输入大师课导师',
            max: 10,
            validator: validators.string.locale({
              textTooBig: "长度不能超过 {1} 个字符"
            })
          },
          {
            type: 'radios',
            label: '编曲是否选自Beats库',
            model: 'fromBeats',
            values: [
              { name: "是", value:2 },
              { name: "否", value:1 },
            ],
            disabled: (model) => { 
                  if(model.disableOrange) { return true; } 
                  return false; 
            },
            styleClasses: "form-beats"

          },
          {
            type: 'select',
            model: 'beatsType',
            values: [],
            selectOptions: {
              noneSelectedText: "请选择beats风格",
              value: 'bcid',
              name: 'bcname',
            },
            visible: (model) => { 
                  if(model.fromBeats === 2) { return true; } 
                  return false; 
            },
            validator: function (val, oldVal,model) {
              if(model.fromBeats === 2 && !val) return ['请选择beats风格！']
              else return []
            },
            onChanged: (model, newVal) => {
              if(_this.beats[newVal]) return
              request('member/beats/search', {btsbcid: newVal}).then(res => {
                if(res.success) {
                  _this.beats[newVal] = res.data
                  _this.beats = {..._this.beats}
                  model.beatsId = null
                }
              })
            }
          },
          {
            type: 'select',
            model: 'beatsId',
            values: (model) => {
              return _this.beats[model.beatsType] || []
            },
            selectOptions: {
              noneSelectedText: "请选择beats",
              value: 'btsid',
              name: 'btsseq',
            },
            visible: (model) => { 
                  if(model.fromBeats === 2) { return true; } 
                  return false; 
            },
            validator: function (val, oldVal,model) {
              if(model.fromBeats === 2 && !val) return ['请选择beats！']
              else return []
            }
          },
          {
            type: 'select',
            model: 'subjectId',
            label: "作品投递于哪期比赛",
            values: [
            ],
            selectOptions: {
              noneSelectedText: "请选择比赛",
            },
            required: true,
            validator: validators.number.locale({
              fieldIsRequired: "请选择比赛",
            })
          },
          {
            type: "textArea",
            label: "歌词",
            model: "songintroduce",
            hint: "最多1000字",
            max: 1000,
            placeholder: "请输入歌词",
            rows: 5,
            required: true,
            validator: validators.string.locale({
              fieldIsRequired: "歌词不能为空!",
              textTooBig: "长度不能超过 {1} 个字符"
            }),
            styleClasses: "form-lyc"
          },
          {
            type: 'radios',
            label: '隐私设置',
            model: 'open',
            values: [
              { name: "公开", value:1 },
              { name: "私密", value:0 },
            ],
            styleClasses: "form-open"

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
  computed: {
    getschema: function () {
      return this.schema
    }
  },
  methods: {
    onSubmit(e) {
      const { model } = this
      let url = 'member/works/save'
      let params = {
        wkid: this.songid,
        wksongname: model.songName,
        wksinger: model.singer.my ? model.singer.othersList.push(model.singer.myName) : model.singer.othersList,
        wkwriter: model.textauthor.my ? model.textauthor.othersList.push(model.textauthor.myName) : model.textauthor.othersList,
        wkmelody: model.songauthor.my ? model.songauthor.othersList.push(model.songauthor.myName) : model.songauthor.othersList,
        wkcompositor: model.styleauthor.my ? model.styleauthor.othersList.push(model.styleauthor.myName) : model.styleauthor.othersList,
        wkteacher: model.teacher,
        wkmasterteacher: model.masterteacher,
        wktype: model.fromBeats,
        wkbtsid: model.beatsId,
        wksubid: model.subjectId,
        wklyric: model.songintroduce,
        wkprivacy: model.open,
        wkcoverurl: this.coverKey,
        wkcovercolor: this.coverColor,
        wksongurl: this.audioKey,
        wksongduration: this.audioDuration,
      }
      request(url, params)
        .then(res => {
          if(res.success)
            this.$modal.show('dialog', {
                      text: '上传成功。',
                      buttons: [
                          {
                            title: '关闭'
                          }
                      ]
            })
          else 
            this.$modal.show('dialog', {
                      text: '上传失败。',
                      buttons: [
                          {
                            title: '关闭'
                          }
                      ]
            })
        })
    },
    onCoverEdit() {
      this.$modal.show('coverEditer')
    },
    onCoverUploaded (key, data, color) {
      this.coverKey = key
      this.coverColor = color
      this.coverImg = URL.createObjectURL(data)
      this.$modal.hide('coverEditer')
    },
    onAudioUploaded(key, data, duration) {
      console.log(data)
      this.audioKey = key
      this.audioDuration = duration
    }
  },
  beforeCreate: function() {
    if(!this.$store.state.userInfo.verify) this.$router.push('/pverify')
    request('member/beats/categories')
        .then(res => {
          if(res.success) {
            this.schema.fields[8].values = res.data
          }
        })
    
    request('guest/activity/activitySubjects')
        .then(res => {
          if(res.success) {
            this.schema.fields[10].values = res.data.map(item => ({id: item.subid, name: item.actname + '-' + item.subname}))
          }
        })
    let songid = this.$route.params.id
    if(songid) {
      this.songid = songid
      request('member/works/detail', { wkid: songid })
        .then(res => {
          if(res.success) {
            const song = res.data
            const { model } = this
            const userInfo = this.$store.state.userInfo
            let parseMy = (nameList, myName, role) => {
              if(!nameList || !nameList.length) return
              let nameIdx = nameList.indexOf(myName)
              if(nameIdx !== -1) {
                role.my = true
                role.myName = myName
                nameList.splice(nameIdx, 1)
              }
              role.others = nameList.length ? true : false
              role.othersList = nameList
            }
            model.songName = song.wksongname
            parseMy(song.wksinger, userInfo.name, model.singer)
            parseMy(song.wkwriter, userInfo.name, model.textauthor)
            parseMy(song.wkmelody, userInfo.name, model.songauthor)
            parseMy(song.wkcompositor, userInfo.name, model.styleauthor)
            model.teacher = song.wkteacher
            model.masterteacher = song.wkmasterteacher
            model.fromBeats = song.wktype
            model.beatsType = song.bcid
            model.beatsId = song.wkbtsid
            model.subjectId = song.wksubid
            model.songintroduce = song.wklyric
            model.open = song.wkprivacy

            this.audioKey = song.wksongurl.substr(song.wksongurl.lastIndexOf('/'))
            this.audioDuration = song.wksongduration
            this.coverKey = song.wkcoverurl.substr(song.wkcoverurl.lastIndexOf('/'))
            this.coverImg = song.wkcoverurl
            this.coverColor = song.wkcovercolor
            if(model.beatsType)
            {
              request('member/beats/search', {btsbcid: model.beatsType}).then(res => {
                if(res.success) {
                  _this.beats[model.beatsType] = res.data
                  _this.beats = {..._this.beats}
                }
              })
            }
          }
        })
    }
    // request('member/index/getSmsCode', { phone: this.model.phone })
    //     .then(res => {
    //       if(!res.success) {
    //         this.model.errMessage = res.messages[0].message
    //         this.model.countDown = 0
    //       } else {
    //         this.smsSessionId = res.data.smsSessionId
    //       }
    //     })
  }
};
</script>
<style lang="less">
.upload-container {
  .upload-title {
    width: 100%;
    padding-top: 20;
    font-size: 18px;
    border-bottom: 1px solid  #D8D8D8;
    box-sizing: border-box;
    nav {
      width: 960px;
      margin: 0 auto;
      text-align: left;
      span {
        display: inline-block;
        width: 100px;
        height: 54px;
        margin-right: 60px;
        line-height: 54px;
        text-align: center;
        &:nth-child(1) {
          color: #B3B3B3;
          border-bottom: 3px solid #fff;
          cursor: pointer;
        }
        &:nth-child(2) {
          color: #000;
          border-bottom: 3px solid #40D77E;
        }
      }
    }
  }
}

.upload {
  width: 960px;
  margin: 0 auto;
  .gap {
    height: 100px;
  }
  .form-title {
    padding-left: 20px;
    height: 30px;
    line-height: 30px;
    text-align: left;
    font-size: 18px;
    color: #181818;
  }
  .song-info {
    display: flex;
    padding-left: 20px;
    .song-cover {
      position: relative;
      width: 280px;
      height: 280px;
      margin-bottom: 100px;
      background: url('../assets/icons/song-cover.png') center no-repeat;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
      span {
        position: absolute;
        left: 0;
        bottom: -30px;
        display: inline-block;
        width: 100%;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: #4A4A4A;
      }
    }
    .form {
      flex: 1;
      margin-left: 30px;
      text-align: left;
      .form-control {
        height: 34px;
        margin-top: 10px;
      }
      .form-lyc .form-control{
        height: inherit;
        width: 100% !important;
      }
      .form-beats {
        .radio-list{
          margin-top: 10px;
          label {
            display: inline-block;
            margin-right: 20px;
          }
        }
      }
      .form-open {
        .radio-list{
          label {
            margin-top: 20px;
            &:nth-child(1):after {
              margin-left: 20px;
              font-size: 12px;
              color: #B3B3B3;
              content: "同意作品公开在songbank、QQ音乐、酷狗、酷我、网易云音乐"
            }
            &:nth-child(2):after {
              margin-left: 20px;
              font-size: 12px;
              color: #B3B3B3;
              content: "暂不想公开作品，仅对自己可见"
            }
          }
        }
      }
      .form-submit {
        margin: 50px auto;
        text-align: right;
        .field-wrap {
          display: inline-block;
        }
        input {
          width: 120px;
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
  .image-uploader {
    width: 960px;
    margin: 0 auto;
  }
  .audio-uploader {
    width: 960px;
    margin: 80px auto 0 auto;
  }
}
.coverEditer {
    width: 520px;
    margin: 0 auto;
}
</style>