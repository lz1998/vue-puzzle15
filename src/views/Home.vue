<template>
  <div class="home">
    <router-view></router-view>
    <mt-tabbar v-model="selected" fixed>
      <mt-tab-item id="/game">
        <div slot="icon" style="line-height:24px;text-align: center;">
          <i class="el-icon-menu"></i>
        </div>
        Game
      </mt-tab-item>
      <mt-tab-item id="/results">
        <div slot="icon" style="line-height:24px;text-align: center;">
          <i class="el-icon-tickets"></i>
        </div>
        Results
      </mt-tab-item>
      <mt-tab-item id="/settings">
        <div slot="icon" style="line-height:24px;text-align: center;">
          <i class="el-icon-setting"></i>
        </div>
        Settings
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data(){
      return{
        selected:'/game'
      }
    },
    watch:{
      selected(val){
        this.$router.push(val)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
