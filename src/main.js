// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store'
import i18n from './lang';
import axios from 'axios'
import VueAxios from 'vue-axios'

import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import { ColorPicker } from 'element-ui';
import VueClipboard from 'vue-clipboard2';
import ECharts from 'vue-echarts/components/ECharts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/markLine';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/legend';
import 'echarts/theme/dark';
import 'echarts/theme/infographic';
import 'echarts/theme/macarons';
import 'echarts/theme/roma';
import 'echarts/theme/shine';
import 'echarts/theme/vintage';
import 'echarts/lib/chart/line';
Vue.component('chart', ECharts);
Vue.use(ColorPicker);
Vue.use(VueAxios, axios);
Vue.use(VueClipboard);
Vue.use(MintUI);
Vue.config.productionTip = false
axios.defaults.baseURL="http://rank.15puzzle.cn/mobile/";

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>',
  mounted(){
    let results=localStorage.getItem("results");
    if(results==null){
      results=[];
    }else{
      results=JSON.parse(results);
    }
    let color0=localStorage.getItem("color0");
    let color1=localStorage.getItem("color1");
    let color2=localStorage.getItem("color2");
    let color3=localStorage.getItem("color3");
    let fontColor=localStorage.getItem("fontColor");
    let panelSetting=localStorage.getItem("panelSetting");
    let userid=localStorage.getItem("userid");
    let access_token=localStorage.getItem("access_token");
    let expires_time=localStorage.getItem("expires_time");

    this.$store.commit("setResults",results);
    this.$store.commit("setColor0",color0);
    this.$store.commit("setColor1",color1);
    this.$store.commit("setColor2",color2);
    this.$store.commit("setColor3",color3);
    this.$store.commit("setFontColor",fontColor);
    this.$store.commit("setPanelSetting",panelSetting);
    this.$store.commit("setUserid",userid);
    this.$store.commit("setAccess_token",access_token);
    this.$store.commit("setExpires_time",expires_time);
  }
})
