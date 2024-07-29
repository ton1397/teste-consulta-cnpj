import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'animate.css';
import { createPinia } from 'pinia'
import VueTheMask from 'vue-the-mask'


const pinia = createPinia()

const app = createApp(App)

app.use(pinia)

app.use(VueTheMask)

app.mount('#app')
