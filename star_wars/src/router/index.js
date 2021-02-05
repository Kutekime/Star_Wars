import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import People from '@/components/People'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },{
    path: '/people/:id',
    props: true,
    name: 'People',
    component: People
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
