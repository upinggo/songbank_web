<template>
  <div class="player-volume-wrap">
    <icon-button
      :class="`player-icon-${volumeIcon}`"
      :icon="volumeIcon"
      @click.native="$emit('togglemute')"
    />
    <div
      class="player-volume-bar-wrap"
      @mousedown="onBarMouseDown"
    >
      <div class="player-volume-bar" ref="bar">
        <div
          class="player-volume"
          :style="{
            height: muted ? 0 : `${Math.trunc(volume * 100)}%`,
            background: theme
          }"
        >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import IconButton from './IconButton.vue'
  import {getElementViewTop} from '../../utils.js'
  const barHeight = 40
  export default {
    components: {
      IconButton,
    },
    props: ['volume', 'muted', 'theme'],
    computed: {
      volumeIcon () {
        if (this.muted || this.volume <= 0) return 'volume-off'
        if (this.volume >= 1) return 'volume-up'
        return 'volume-down'
      },
    },
    methods: {
      onBarMouseDown () {
        console.log('onBarMouseDown')
        document.addEventListener('mousemove', this.onDocumentMouseMove)
        document.addEventListener('mouseup', this.onDocumentMouseUp)
      },
      onDocumentMouseMove (e) {
        let percentage = (barHeight - e.clientY + getElementViewTop(this.$refs.bar)) / barHeight
        percentage = percentage > 0 ? percentage : 0
        percentage = percentage < 1 ? percentage : 1
        this.$emit('setvolume', percentage)
      },
      onDocumentMouseUp (e) {
        document.removeEventListener('mouseup', this.onDocumentMouseUp)
        document.removeEventListener('mousemove', this.onDocumentMouseMove)
        let percentage = (barHeight - e.clientY + getElementViewTop(this.$refs.bar)) / barHeight
        percentage = percentage > 0 ? percentage : 0
        percentage = percentage < 1 ? percentage : 1
        this.$emit('setvolume', percentage)
      }
    }
  }
</script>

<style lang="less">
  .player-volume-wrap {
    position: relative;
    cursor: pointer;
    z-index: 0;
    &:hover .player-volume-bar-wrap {
      display: block;
    }
    .player-volume-bar-wrap {
      display: none;
      position: absolute;
      bottom: 20px;
      left: 12px;
      right: 0px;
      height: 40px;
      z-index: -1;
      transition: all .2s ease;
      &::after {
        content: '';
        position: absolute;
        bottom: -20px;
        left: 0;
        right: 0;
        height: 68px;
        background-color: #fff;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.07), 0 0 5px 0 rgba(0, 0, 0, 0.1);
      }
      .player-volume-bar {
        position: absolute;
        bottom: 0;
        left: 11px;
        width: 5px;
        height: 40px;
        background: #aaa;
        border-radius: 2.5px;
        overflow: hidden;
        z-index: 1;
        .player-volume {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          transition: height 0.1s ease, background-color .3s;
          will-change: height;
        }
      }
    }
  }
</style>