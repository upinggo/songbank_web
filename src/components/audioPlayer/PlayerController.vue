<template>
  <div class="player-controller">
    <div class="player-time">
      <icon-button
        class="player-icon-mode"
        icon="prev"
        @click.native="$emit('pre')"
      />
      <icon-button
        class="player-icon-mode"
        :icon="playing ? 'pause' : 'play'"
        @click.native="$emit('toggleplay')"
      />
      <icon-button
        class="player-icon-mode"
        icon="next"
        @click.native="$emit('next')"
      />
      <icon-button
        class="player-icon-mode"
        icon="shuffle"
        :class="{ 'inactive': !shuffle }"
        @click.native="$emit('toggleshuffle')"
      />
      <icon-button
        class="player-icon-mode"
        :icon="repeat === 'repeat-one' ? 'repeat-one' : 'repeat-all'"
        :class="{ 'inactive': repeat === 'no-repeat'}"
        @click.native="$emit('nextmode')"
      />
    </div>
    <v-progress
      :loadProgress="loadProgress"
      :playProgress="playProgress"
      :theme="theme"
      @dragbegin="val => $emit('dragbegin', val)"
      @dragend="val => $emit('dragend', val)"
      @dragging="val => $emit('dragging', val)"
    />
    <div class="player-time">
      <div class="player-time-inner">
        - <span class="player-ptime">{{secondToTime(stat.playedTime)}}</span> / <span
        class="player-dtime">{{secondToTime(stat.duration)}}</span>
      </div>
      <volume
        v-if="!$parent.isMobile"
        :volume="volume"
        :theme="theme"
        :muted="muted"
        @togglemute="$emit('togglemute')"
        @setvolume="v => $emit('setvolume', v)"
      />
    </div>
  </div>
</template>

<script>
  import IconButton from './IconButton.vue'
  import VProgress from './PlayerControllerProgress.vue'
  import Volume from './PlayerControllerVolume.vue'
  export default {
    components: {
      IconButton,
      VProgress,
      Volume,
    },
    props: ['shuffle', 'repeat', 'stat', 'theme', 'volume', 'muted', 'playing'],
    computed: {
      loadProgress () {
        if (this.stat.duration === 0) return 0
        return this.stat.loadedTime / this.stat.duration
      },
      playProgress () {
        if (this.stat.duration === 0) return 0
        return this.stat.playedTime / this.stat.duration
      },
    },
    methods: {
      secondToTime (second) {
        if (isNaN(second)) {
          return '00:00'
        }
        const pad0 = (num) => {
          return num < 10 ? '0' + num : '' + num
        }
        const min = Math.trunc(second / 60)
        const sec = Math.trunc(second - min * 60)
        const hours = Math.trunc(min / 60)
        const minAdjust = Math.trunc((second / 60) - (60 * Math.trunc((second / 60) / 60)))
        return second >= 3600 ? pad0(hours) + ':' + pad0(minAdjust) + ':' + pad0(sec) : pad0(min) + ':' + pad0(sec)
      },
    },
  }
</script>

<style lang="less">
  .player-controller {
    display: flex;
    flex-grow: 1;
    align-items: center;
    position: relative;
    .player-time {
      display: flex;
      align-items: center;
      position: relative;
      height: 20px;
      color: #999;
      font-size: 11px;
      padding-left: 7px;
      .player-volume-wrap {
        margin-left: 4px;
        margin-right: 4px;
      }
      .player-icon {
        cursor: pointer;
        transition: all 0.2s ease;
        margin-left: 20px;
        &.inactive {
          opacity: .3;
        }
        .player-fill {
          fill: #666;
        }
        &:hover {
          .player-fill {
            fill: #000;
          }
        }
        &.player-icon-menu {
          display: none;
        }
      }
      .player-volume-wrap + .player-icon {
        margin-left: 0;
      }
      &.player-time-narrow {
        .player-icon-mode {
          display: none;
        }
        .player-icon-menu {
          display: none;
        }
      }
    }
  }
</style>