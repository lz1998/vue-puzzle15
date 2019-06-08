import Vue from 'vue';
import VueI18n from 'vue-i18n';

import zhLocale from './zh';
import enLocale from './en';

Vue.use(VueI18n);

// 准备翻译的语言环境信息
const messages = {
  zh:zhLocale,
  en: enLocale
}
let getLang=function(){
  let lang=localStorage.getItem("lang");
  if(lang)return lang;
  else lang="zh";
  return lang;
}

//localStorage.setItem("lang","en");
// 通过选项创建 VueI18n 实例
const i18n = new VueI18n({
  locale: getLang(), // 设置地区
  messages, // 设置地区信息
})
export default i18n;
