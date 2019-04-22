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

// 通过选项创建 VueI18n 实例
const i18n = new VueI18n({
  locale: 'en', // 设置地区
  messages, // 设置地区信息
})
export default i18n;
