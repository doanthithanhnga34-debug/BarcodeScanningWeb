import { createApp } from 'vue'
import { router } from './router'
import './assets/styles/main.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'; 
import ToastService from 'primevue/toastservice';
const app = createApp(App);

app.use(router)
app.use(PrimeVue, {
  theme: {
        preset: Aura
    }
})
app.use(ToastService);
app.mount('#app')