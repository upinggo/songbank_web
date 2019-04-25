<template>
  <div class="upload-container">
    <div class="select-container" @drop="onFileDrop" @dragenter="onDraging" @dragover="onDraging">
      <div class="upload-icon"><img src="@/assets/icons/upload-file-icon.png" /></div>
      <div class="text-tdnd">拖动你的音频文件在这里</div>
      <div class="input-file">
          <label>或选择本地音频上传</label>
          <input @change="onFileChange" type="file" accept=".mp3, .wav, .ogg, .acc, .webm">
      </div>
      <div class="text-wjgs">文件格式xx大小不超过xx</div>
    </div>
    <div class="file-info-container">
      <div class="file-info">
        <div class="file-name">{{upFileName}}</div>
        <div class="file-size">{{(uploadedSize / 1024 / 1024).toFixed(2)}}MB/<label>{{(upFileSize / 1024 / 1024).toFixed(2)}}MB</label></div>
      </div>
      <div class="upload-progress">
        <div class="progress" :style="{width: upPercent + '%'}"></div>
      </div>
    </div>
  </div>
</template>
<script>
import * as qiniu from 'qiniu-js'
import { request } from '../utils.js'

const audio = new Audio()
export default {
  data() {
    return {
      upImageType: '',
      file: null,
      duration: 0,
      upFileName: '请选择音频文件',
      upFileSize: 0,
      uploadedSize: 0,
      upPercent: 0,
    }
  },
  props: {
    autoCrop: {
      type: Boolean,
      default: true,
    },
    mode: {
      type: String,
      default: 'auto',
    },
    tokenKey: {
      type: String,
      default: 'audio',
    }
  },
  components: {
  },
  methods: {
    onFileChange (e) {
      let files = e.target.files;
      if (files && files.length) {
        this.upload(files[0])
      }
    },
    onDraging (e) {
      e.preventDefault();
    },
    onFileDrop (e) {
      e.preventDefault(); 
      console.log(e)
      let files = e.dataTransfer.files;
      if (files && files.length) {
        this.upload(files[0])
      }
    },
    showErrInfo(err) {
        this.upFileName = err
    },
    upload (file) {
      if(this.file) {
        //this.showErrInfo("文件格式不符合，请重新选择正确的文件。")
        return
      }
      if (/^audio\/\w+$/.test(file.type)) {
        this.file = file
        audio.src = URL.createObjectURL(file)
      } else {
        this.showErrInfo("文件格式不符合，请重新选择正确的文件。")
      }

    }
  },
  created() {
    audio.addEventListener('error', err => {
      this.file =null
      this.showErrInfo("文件格式不符。")
    })
    audio.addEventListener('loadedmetadata', data => {
      request('member/qiniu/token', {type: this.tokenKey}).then(res => {
        if(!res.success) {
          this.file = null
          return
        }
        this.duration = audio.duration
        this.upFileSize = this.file.size
        this.upFileName = this.file.name
        let observable = qiniu.upload(
          this.file,
          null,
          res.data.uptoken,
          {
            fname: this.upFileName,
            params: {},
            mimeType: null
          },
          {
            useCdnDomain: true,
            disableStatisticsReport: false,
            retryCount: 3,
          })
        let subscription = observable.subscribe({
          next: (res)=>{
            this.uploadedSize = res.total.loaded
            this.upPercent = res.total.percent
          },
          error: (err) => {
            this.showErrInfo("上传失败。")
            this.file = null
          },
          complete: (res) => {
            let key = res.key
            this.$emit('uploadComplete', key, this.file, this.duration)
            this.file = null
          },
        })
      })
    })
  }
}
</script>
<style lang="less" scoped>
  .upload-container {
    position: relative;
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
    min-width: 400px;
    min-height: 500px;
    .select-container {
      display: flex;
      flex-flow: column;
      justify-content: center;
      width: 100%;
      flex: 1;
      padding: 20px;
      border: 1px dashed #E1E1E1;
      background-color: #FBFBFB;
      box-sizing: border-box;
      .text-tdnd {
        margin: 40px 0;
        font-size: 16px;
        color: #333333;
      }
      .text-wjgs {
        font-size: 12px;
        color: #9B9B9B;
        margin: 20px 0 30px 0;
      }
      .input-file {
        position: relative;
        width: 240px;    
        height: 48px;
        line-height: 48px;
        margin: 0 auto;
        input {   
          width: 100%;
          height: 100%;
          opacity: 0;
          vertical-align: top;
        }
        label {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 100%;
          color: #fff;
          background: #40D77E;
          box-shadow: 0 12px 24px 0 rgba(64,215,126,0.30);
          border-radius: 4px;
        }
      }
    }
    .file-info-container {
      width: 100%;
      margin-top: 20px;
      .file-info {
        display: flex;
        width: 100%;
        height: 30px;
        padding: 0 10px;
        font-size: 14px;
        line-height: 30px;
        box-sizing: border-box;
        .file-name {
          flex: 1;
        }
        .file-size {
          label {
            color:#9B9B9B;
          }
        }
      }
      .upload-progress {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background-color: #f5f5f5;
        .progress {
          height: 100%;
          border-radius: 3px;
          background-image: linear-gradient(-90deg, #74EDB5 0%, #40D77E 100%);
        }
      }
    }
  }
</style>
