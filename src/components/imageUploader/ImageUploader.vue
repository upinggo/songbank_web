<template>
  <div class="cropper-container">
    <div class="cropper-cut">
      <div class="con"></div>
      <VueCropper
        ref="cropper"
        class="cropper"
        :img="sourceImg"
        :autoCrop="autoCrop"
        :fixed="fixed"
        :infoTrue="infoTrue"
        :centerBox="centerBox"
        :full="full"
        :autoCropWidth="autoCropWidth"
        :autoCropHeight="autoCropHeight"
        :enlarge="enlarge"
        :fixedBox="fixedBox"
        :mode="mode"
      />
      <div class="scale-btn"><i @click="changeScale(-1)"/> <i @click="changeScale(1)"/></div>
    </div>
    <div class="bottom-tools">
      <div class="input-image">
          <label >{{upImageName}}</label>
          <input @change="onImgChange" type="file" accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff">
      </div>
      <button class="upload-btn" :disabled="!sourceImg" @click="onUpload">上传</button>
    </div>
  </div>
</template>
<script>
import {VueCropper} from 'vue-cropper';
import { request } from '../../utils.js'
import analyze from 'rgbaster'
import * as qiniu from 'qiniu-js'
export default {
  data() {
    return {
      sourceImg: '',
      upImageName: '请选择图片',
      upImageType: '',
    }
  },
  props: {
    autoCrop: {
      type: Boolean,
      default: true,
    },
    fixed: {
      type: Boolean,
      default: true,
    },
    infoTrue: {
      type: Boolean,
      default: true,
    },
    centerBox: {
      type: Boolean,
      default: true,
    },
    full: {
      type: Boolean,
      default: false,
    },
    maxImgSize: {
      type: Number,
      default: 2000,
    },
    autoCropWidth: {
      type: Number,
      default: 250,
    },
    autoCropHeight: {
      type: Number,
      default: 250,
    },
    enlarge: {
      type: Number,
      default: 2,
    },
    fixedBox: {
      type: Boolean,
      default: true,
    },
    mode: {
      type: String,
      default: 'cover',
    },
    tokenKey: {
      type: String,
      default: 'avatar',
    }
  },
  components: {
    VueCropper
  },
  methods: {
    onImgChange (e) {
      let files = e.target.files;
      if (files && files.length) {
        let file = files[0];

        if (/^image\/\w+$/.test(file.type)) {
          this.upImageName = file.name;
          this.upImageType = file.type;

          if (this.sourceImg) {
            URL.revokeObjectURL(this.sourceImg);
          }

          this.sourceImg = URL.createObjectURL(file);
          //$uploadBtn.prop('disabled', false);
        }
      }
    },
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    onUpload (e) {
      this.$refs.cropper.getCropBlob((data) => {
        request('member/qiniu/token', {type: this.tokenKey}).then(res => {
          if(!res.success) {
            return
          }
          let observable = qiniu.upload(
            data,
            null,
            res.data.uptoken,
            {
              fname: this.upImageName,
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
            error: (err) => console.log(e),
            complete: async (res) => {
              let key = res.key
              let color = await analyze(URL.createObjectURL(data))
              this.$emit('uploadComplete', key, data, color[0].color)
            },
          })
        })

      })
    }
  }
}
</script>
<style lang="less" scoped>
  .cropper-container {
    width: 100%;
    padding: 20px 0 10px;
    box-sizing: border-box;
    .cropper-cut {
      position: relative;
      width: 100%;
      .con {
        padding-top: 60%;
      }
      .cropper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
    .scale-btn {
      position: absolute;
      bottom: 6px;
      right: 20px;
      i {
        display: inline-block;
        width: 32px;
        height: 32px;
        cursor: pointer;
        &:nth-child(1) {
          background:url("../../assets/icons/reduce.png") center/cover no-repeat;
        }
        &:nth-child(2) {
          margin-left: 20px;
          background:url("../../assets/icons/add.png") center/cover no-repeat;
        }
      }
    }
    .bottom-tools {
      width: 100%;
      height: 40px;
      padding: 10px 0;
      display: flex;
      line-height: 40px;
      text-align: center;
      .input-image {
        position: relative;
        flex: 1;
        input {   
          width: 100%;
          height: 100%;
          opacity: 0;
        }
        label {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 100%;
          color: #495057;
          background-color: #fff;
          border: 1px solid #40D77E;
          border-radius: 4px;
          &::after {
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              display: block;
              height: 100%;
              padding: 0 15px;
              box-sizing: border-box;
              color: #fff;
              content: "选择";
              background-color: #40D77E;
              border-left: 1px solid #ced4da;
              border-radius: 0 4px 4px 0;
            }
        }
      }
      .upload-btn {
        width: 80px;
        margin-left: 20px;
        background-color: #e9ecef;
        border-radius: 4px;
        border: 1px solid #40D77E;
        background: #40D77E !important;
        color: #fff;
      }
    }
  }
</style>
