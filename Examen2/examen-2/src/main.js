import { createApp } from 'vue';
import { BootstrapVue3 } from 'bootstrap-vue-3';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

import App from './App.vue';
import { createRouter, createWebHistory } from "vue-router";

import CoffeeMachine from './components/CoffeeMachine.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "Home", component: CoffeeMachine },
    ],
});

const app = createApp(App);

app.use(BootstrapVue3);

app.use(router);

app.mount("#app");
