// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import i18n from './lang';
import Vuex from 'vuex';


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
import 'echarts/lib/chart/line';
Vue.component('chart', ECharts);
Vue.use(ColorPicker);
Vue.use(Vuex);
Vue.use(VueClipboard);
Vue.use(MintUI);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
})
