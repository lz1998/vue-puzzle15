import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Home from 'views/Home';
import Game from 'views/Game/Game';
import Results from 'views/Results/Results';
import Settings from 'views/Settings/Settings';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      children:[
        {path:'/',redirect:'/game'},
        {path:'/game',component:Game},
        {path:'/results',component:Results},
        {path:'/settings',component:Settings}
      ]
    },
  ]
})
