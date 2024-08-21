import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
app.use(router)

if (window.location.pathname === '/ControlArchivos') {
  app.mount('#control-archivos')
} else {
  app.mount('#app')
}
