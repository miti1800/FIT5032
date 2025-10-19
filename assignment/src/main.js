// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './firebaseConfig'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/css/custom.css'

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            primary: {
                50: '#e0f2f7',
                500: '#3c6e71',
            },
            surface: {
                50: '#f8f9fa',
                100: '#f1f3f5',
            },
        },
    }
});
app.use(router);

app.use(ToastService);

app.mount('#app');