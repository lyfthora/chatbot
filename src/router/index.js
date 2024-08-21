import { createRouter, createWebHistory } from 'vue-router'
import MiChatbot from '../components/chatbot.vue'
import ControlArchivos from '../components/ControlArchivos.vue'

const routes = [
  {
    path: '/',
    name: 'Chatbot',
    component: MiChatbot
  },
  {
    path: '/controlarchivos',
    name: 'ControlArchivos',
    component: ControlArchivos
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
