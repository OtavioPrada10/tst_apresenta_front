import { createApp } from 'vue';
import App from './App.vue';
import router from '../src/router';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

createApp(App).use(router).mount('#app');