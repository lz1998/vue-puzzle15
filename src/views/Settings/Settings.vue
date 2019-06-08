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
        color0:this.$store.state.color0,
        color1:this.$store.state.color1,
        color2:this.$store.state.color2,
        color3:this.$store.state.color3,
        fontColor:this.$store.state.fontColor,
        panelSetting:this.$store.state.panelSetting
      }
    },
    computed:{
      lang:{
        set(value){
          this.$store.commit('setLang',value)
        },
        get(){
          return this.$store.state.lang;
        }
      }
    },
    methods:{
      saveChange(){
        this.$store.commit("setColor0",this.color0);
        this.$store.commit("setColor1",this.color1);
        this.$store.commit("setColor2",this.color2);
        this.$store.commit("setColor3",this.color3);
        this.$store.commit("setFontColor",this.fontColor);
        this.$store.commit("setPanelSetting",this.panelSetting);
      },
      langChange(){
        if(this.$i18n.locale=="zh"){
          this.$i18n.locale="en";
          this.lang="en";
        }
        else{
          this.$i18n.locale="zh";
          this.lang="zh";
        }
      }
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
