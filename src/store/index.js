import Vue from 'vue';
import Vuex from 'vuex';
import * as getters from './getters'
import * as mutations from './mutations'
Vue.use(Vuex);

const state={
  lang:'zh',
  results:[],
  color0:"rgba(243,197,0,1)",
  color1:"rgba(31,169,93,1)",
  color2:"rgba(39,117,167,1)",
  color3:"rgba(234,75,53,1)",
  fontColor:"rgba(0,0,0,1)",
  panelSetting:"",
  userid:'',
  access_token:'',
  expires_time:''
}
export default new Vuex.Store({
  state,
  getters,
  mutations
})
