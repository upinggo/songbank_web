<template>
  <button
    type="button"
    class="player-icon"
  >
    <Icon :type="icon"/>
  </button>
</template>

<script>
  import Icon from './Icon.vue'
  export default {
    components: {
      Icon,
    },
    props: ['icon'],
  }
</script>


<style lang="less">
  .player-icon {
    width: 20px;
    height: 20px;
    border: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    opacity: .8;
    vertical-align: middle;
    padding: 0;
    font-size: 12px;
    margin: 0;
    display: inline;
    &:hover {
      opacity: 1;
    }
    .player-fill {
      transition: all .2s ease-in-out;
    }
  }
</style>