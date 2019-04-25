<template>
  <div
    class="player-bar-wrap"
    @mousedown="onThumbMouseDown"
    @touchstart="onThumbTouchStart"
    ref="barWrap"
  >
    <div class="player-bar">
      <div
        class="player-loaded"
        :style="{width: `${loadProgress * 100}%`}">
      </div>
      <div
        class="player-played"
        :style="{width: `${playProgress * 100}%`, background: theme}"
      >
        <span
          ref="thumb"
          @mouseover="thumbHovered = true"
          @mouseout="thumbHovered = false"
          class="player-thumb"
          :style="{borderColor:　theme, backgroundColor: thumbHovered ? theme : '#fff'}"
        >
          <span class="player-loading-icon"
                :style="{backgroundColor: theme }"
          >
            <icon type="loading"/>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import {getElementViewLeft} from '../../utils.js'
  import Icon from './Icon.vue'
  export default {
    components: {
      Icon
    },
    props: ['loadProgress', 'playProgress', 'theme'],
    data () {
      return {
        thumbHovered: false,
      }
    },
    methods: {
      onThumbMouseDown (e) {
        const barWidth = this.$refs.barWrap.clientWidth
        let percentage = (e.clientX - getElementViewLeft(this.$refs.barWrap)) / barWidth
        percentage = percentage > 0 ? percentage : 0
        percentage = percentage < 1 ? percentage : 1
        this.$emit('dragbegin', percentage)
        document.addEventListener('mousemove', this.onDocumentMouseMove)
        document.addEventListener('mouseup', this.onDocumentMouseUp)
      },
      onDocumentMouseMove (e) {
        const barWidth = this.$refs.barWrap.clientWidth
        let percentage = (e.clientX - getElementViewLeft(this.$refs.barWrap)) / barWidth
        percentage = percentage > 0 ? percentage : 0
        percentage = percentage < 1 ? percentage : 1
        this.$emit('dragging', percentage)
      },
      onDocumentMouseUp (e) {
        document.removeEventListener('mouseup', this.onDocumentMouseUp)
        document.removeEventListener('mousemove', this.onDocumentMouseMove)
        const barWidth = this.$refs.barWrap.clientWidth
        let percentage = (e.clientX - getElementViewLeft(this.$refs.barWrap)) / barWidth
        percentage = percentage > 0 ? percentage : 0
        percentage = percentage < 1 ? percentage : 1
        this.$emit('dragend', percentage)
      },
      onThumbTouchStart (e) {
        const barWidth = this.$refs.barWrap.clientWidth
        let percentage = (e.clientX - getElementViewLeft(this.$refs.barWrap)) / barWidth
        percentage = percentage > 0 ? percentage : 0
        percentage = percentage < 1 ? percentage : 1
        this.$emit('dragbegin', percentage)
        document.addEventListener('touchmove', this.onDocumentTouchMove)
        document.addEventListener('touchend', this.onDocumentTouchEnd)
      },
      onDocumentTouchMove (e) {
        const touch = e.changedTouches[0]
        const barWidth = this.$refs.barWrap.clientWidth
        let percentage = (touch.clientX - getElementViewLeft(this.$refs.barWrap)) / barWidth
        percentage = percentage > 0 ? percentage : 0
        percentage = percentage < 1 ? percentage : 1
        this.$emit('dragging', percentage)
      },
      onDocumentTouchEnd (e) {
        document.removeEventListener('touchend', this.onDocumentTouchEnd)
        document.removeEventListener('touchmove', this.onDocumentTouchMove)
        const touch = e.changedTouches[0]
        const barWidth = this.$refs.barWrap.clientWidth
        let percentage = (touch.clientX - getElementViewLeft(this.$refs.barWrap)) / barWidth
        percentage = percentage > 0 ? percentage : 0
        percentage = percentage < 1 ? percentage : 1
        this.$emit('dragend', percentage)
      },
    },
  }
</script>
<style lang="less">
  .player-bar-wrap {
    margin: 0 0 0 40px;
    padding: 4px 0;
    cursor: pointer;
    flex: 1;
    .player-bar {
      position: relative;
      height: 2px;
      width: 100%;
      background: #cdcdcd;
      .player-loaded {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: #aaa;
        height: 2px;
        transition: all 0.5s ease;
        will-change: width;
      }
      .player-played {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        height: 2px;
        transition: background-color .3s;
        will-change: width;
        .player-thumb {
          position: absolute;
          top: 0;
          right: 5px;
          margin-top: -5px;
          margin-right: -10px;
          width: 10px;
          height: 10px;
          border: 1px solid;
          transform: scale(.8);
          will-change: transform;
          transition: transform 300ms, background-color .3s, border-color .3s;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          &:hover {
            transform: scale(1);
          }
          overflow: hidden;
          .player-loading-icon {
            display: none;
            width: 100%;
            height: 100%;
            svg {
              position: absolute;
              animation: spin 1s linear infinite;
              fill: #ffffff;
            }
          }
        }
      }
    }
  }
  .player-loading {
    .player-bar-wrap .player-bar .player-thumb .player-loading-icon {
      display: block;
    }
    .player-info .player-controller .player-bar-wrap .player-bar .player-played .player-thumb {
      transform: scale(1);
    }
  }
  @keyframes spin {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg)
    }
  }
</style>