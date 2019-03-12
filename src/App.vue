<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        selected:"外卖"
      }
    }
  }
</script>

<style>
  #app{
    margin:0;
    padding:0;
  }
</style>
