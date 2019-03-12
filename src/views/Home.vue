<template>
  <div class="home">
    <router-view></router-view>
    <mt-tabbar v-model="selected" fixed>
      <mt-tab-item id="Game">
        <router-link to="/game">Game</router-link>
      </mt-tab-item>
      <mt-tab-item id="Results">
        <router-link to="/results">Results</router-link>
      </mt-tab-item>
      <mt-tab-item id="Settings">
        <router-link to="/settings">Settings</router-link>
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data(){
      return{
        selected:'Game'
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .mint-tab-item a
    text-decoration: none
    display: block
    line-height :30px
    color:black
</style>
