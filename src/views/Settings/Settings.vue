<template>
  <div class="settings">
    <h2 style="text-align: center;">{{$t('settings.title')}}</h2>
    <mt-cell :title="$t('settings.background')">
      <span>
        <mt-field style="width: 200px" type="text" v-model="color0"></mt-field>
      </span>
      <span>
        <el-color-picker size="small" show-alpha v-model="color0"></el-color-picker>
      </span>
    </mt-cell>
    <mt-cell :title="$t('settings.inner')">
      <span>
        <mt-field style="width: 200px" type="text" v-model="color1"></mt-field>
      </span>
      <span>
       <el-color-picker size="small" show-alpha v-model="color1"></el-color-picker>
      </span>
    </mt-cell>
    <mt-cell :title="$t('settings.middle')">
      <span>
        <mt-field style="width: 200px" type="text" v-model="color2"></mt-field>
      </span>
      <span>
        <el-color-picker size="small" show-alpha v-model="color2"></el-color-picker>
      </span>
    </mt-cell>
    <mt-cell :title="$t('settings.outer')">
      <span>
        <mt-field style="width: 200px" type="text" v-model="color3"></mt-field>
      </span>
      <span>
        <el-color-picker size="small" show-alpha v-model="color3"></el-color-picker>
      </span>
    </mt-cell>
    <mt-cell :title="$t('settings.font')">
      <span>
        <mt-field style="width: 200px" type="text" v-model="fontColor"></mt-field>
      </span>
      <span>
        <el-color-picker size="small" show-alpha v-model="fontColor"></el-color-picker>
      </span>
    </mt-cell>
    <mt-cell :title="$t('settings.other')">
      <span>
        <mt-field type="text" v-model="panelSetting"></mt-field>
      </span>
    </mt-cell>
    <mt-button @click.native="saveChange" class="save-button" type="primary">{{$t('settings.save')}}</mt-button>
    <mt-button @click.native="langChange" class="lang-button" type="primary">中文/English</mt-button>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data(){
      return{
        color0:"rgba(243,197,0,1)",
        color1:"rgba(31,169,93,1)",
        color2:"rgba(39,117,167,1)",
        color3:"rgba(234,75,53,1)",
        fontColor:"rgba(0,0,0,1)",
        panelSetting:""
      }
    },
    methods:{
      saveChange(){
        localStorage.setItem("color0",this.color0);
        localStorage.setItem("color1",this.color1);
        localStorage.setItem("color2",this.color2);
        localStorage.setItem("color3",this.color3);
        localStorage.setItem("fontColor",this.fontColor);
        localStorage.setItem("panelSetting",this.panelSetting);
        document.querySelector('body').setAttribute('style', 'background:'+this.color0);
      },
      langChange(){
        if(this.$i18n.locale=="zh"){
          this.$i18n.locale="en";
          localStorage.setItem("lang","en");
        }
        else{
          this.$i18n.locale="zh";
          localStorage.setItem("lang","zh");
        }
      }
    },
    mounted(){
      this.color0=localStorage.getItem("color0");
      this.color1=localStorage.getItem("color1");
      this.color2=localStorage.getItem("color2");
      this.color3=localStorage.getItem("color3");
      this.fontColor=localStorage.getItem("fontColor");
      this.panelSetting=localStorage.getItem("panelSetting");
      if(this.color0==null || this.color0==='null'){
        this.color0="rgba(243,197,0,1)";
      }
      if(this.color1==null || this.color1==='null'){
        this.color1="rgba(31,169,93,1)";
      }
      if(this.color2==null || this.color2==='null'){
        this.color2="rgba(39,117,167,1)";
      }
      if(this.color3==null || this.color3==='null'){
        this.color3="rgba(234,75,53,1)";
      }
      if(this.fontColor==null || this.fontColor==='null'){
        this.fontColor="rgba(0,0,0,1)";
      }
      document.querySelector('body').setAttribute('style', 'background:'+this.color0);

    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .save-button
    margin:10px
    float:left
  .lang-button
    margin:10px
  .settings
    padding:10px
    padding-bottom:100px
</style>
