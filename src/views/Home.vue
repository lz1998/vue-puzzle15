<template>
  <div class="home">
    <router-view></router-view>
    <mt-tabbar v-model="selected" fixed>
      <mt-tab-item id="/game">
        <div slot="icon" style="line-height:24px;text-align: center;">
          <i class="el-icon-menu"></i>
        </div>
        {{$t('tabbar.game')}}
      </mt-tab-item>
      <mt-tab-item id="/results">
        <div slot="icon" style="line-height:24px;text-align: center;">
          <i class="el-icon-tickets"></i>
        </div>
        {{$t('tabbar.results')}}
      </mt-tab-item>
      <mt-tab-item id="/settings">
        <div slot="icon" style="line-height:24px;text-align: center;">
          <i class="el-icon-setting"></i>
        </div>
        {{$t('tabbar.settings')}}
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
