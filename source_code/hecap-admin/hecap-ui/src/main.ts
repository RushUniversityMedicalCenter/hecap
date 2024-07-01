import { createApp } from 'vue';
import { createPinia } from "pinia";
import App from './App.vue';
import {router} from './router';
import vuetify from './plugins/vuetify';
import '@/scss/style.scss';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import Maska from 'maska';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

import { msalPlugin } from "./plugins/msalPlugin";
import { msalInstance } from "./authConfig";
import { AuthenticationResult, EventType } from "@azure/msal-browser";

// Account selection logic is app dependent. Adjust as needed for different use cases.
const accounts = msalInstance.getAllAccounts();
//console.log("==main.ts: all accounts:", JSON.stringify(accounts))
if (accounts.length > 0) {
  for(let account of accounts) {
    if (account.username && account.username.includes('rush.edu')){
      msalInstance.setActiveAccount(account);
    } 
  }
}
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as AuthenticationResult;
    const account = payload.account;
    msalInstance.setActiveAccount(account);
  }
});

const app = createApp(App);
app.use(createPinia())
app.use(router);
app.use(PerfectScrollbar);
app.use(VueTablerIcons);
app.use(Maska);
app.use(VueApexCharts);
app.use(vuetify);
app.use(msalPlugin, msalInstance)
app.mount('#app');
app.component('EasyDataTable', Vue3EasyDataTable);
app.config.errorHandler = (err) => {
    console.log("===app level error caught:", err)
  }
