<template>
  <div class="settings">
    <h2 style="text-align: center;">Settings</h2>
    <mt-cell title="背景色">
      <span>
        <mt-field style="width: 100px" type="text" v-model="color0"></mt-field>
      </span>
      <span>
        <mt-field style="width: 80px" type="color" v-model="color0"></mt-field>
      </span>
    </mt-cell>
    <mt-cell title="内层色">
      <span>
        <mt-field style="width: 100px" type="text" v-model="color1"></mt-field>
      </span>
      <span>
        <mt-field style="width: 80px" type="color" v-model="color1"></mt-field>
      </span>
    </mt-cell>
    <mt-cell title="中层色">
      <span>
        <mt-field style="width: 100px" type="text" v-model="color2"></mt-field>
      </span>
      <span>
        <mt-field style="width: 80px" type="color" v-model="color2"></mt-field>
      </span>
    </mt-cell>
    <mt-cell title="外层色">
      <span>
        <mt-field style="width: 100px" type="text" v-model="color3"></mt-field>
      </span>
      <span>
        <mt-field style="width: 80px" type="color" v-model="color3"></mt-field>
      </span>
    </mt-cell>
    <mt-cell title="字体色">
      <span>
        <mt-field style="width: 100px" type="text" v-model="fontColor"></mt-field>
      </span>
      <span>
        <mt-field style="width: 80px" type="color" v-model="fontColor"></mt-field>
      </span>
    </mt-cell>
    <mt-button @click.native="colorChange" class="save-button" type="primary">Save</mt-button>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data(){
      return{
        color0:"#f3c500",
        color1:"#1bae5d",
        color2:"#217fbc",
        color3:"#ea4b35",
        fontColor:"#000000"
      }
    },
    methods:{
      colorChange(){
        localStorage.setItem("color0",this.color0);
        localStorage.setItem("color1",this.color1);
        localStorage.setItem("color2",this.color2);
        localStorage.setItem("color3",this.color3);
        localStorage.setItem("fontColor",this.fontColor);
      }
    },
    mounted(){
      this.color0=localStorage.getItem("color0");
      this.color1=localStorage.getItem("color1");
      this.color2=localStorage.getItem("color2");
      this.color3=localStorage.getItem("color3");
      this.fontColor=localStorage.getItem("fontColor");
      if(this.color0==null){
        this.color0="#f3c500";
      }
      if(this.color1==null){
        this.color1="#1bae5d";
      }
      if(this.color2==null){
        this.color2="#217fbc";
      }
      if(this.color3==null){
        this.color3="#ea4b35";
      }
      if(this.fontColor==null){
        this.fontColor="#000000";
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .save-button
    margin:10px
    float:right
  .settings
    padding:10px
    padding-bottom:100px
</style>
