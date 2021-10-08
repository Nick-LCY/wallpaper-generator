import Vue from 'vue'
import VueRouter from 'vue-router'
import InputPage from '../views/InputPage.vue'
import Result from '../views/Result.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'InputPage',
    component: InputPage
  },
  {
    path: '/result',
    name: 'Result',
    component: Result
  }
]

const router = new VueRouter({
  routes
})

export default router
