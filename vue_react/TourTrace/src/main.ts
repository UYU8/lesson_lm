import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/tailwind.css'
import router from './router/index'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia()) // pinia的挂载
app.use(router) // vue-router的挂载
app.mount('#app')