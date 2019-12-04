import Vue from 'vue';
import VueLodash from 'vue-lodash';
import { sync } from 'vuex-router-sync';
import vueLogger from 'vue-logger';

import App from './approot.vue';
import vuetify from './plugins/vuetify';

import store from './store/index';
import router from './router';
import './components/Fundament/Fundament.css';
import './style.css';

Vue.config.productionTip = false;

Vue.use(vueLogger, {
  dev: process.env.NODE_ENV !== 'production',
  shortname: true,
  levels: ['log', 'warn', 'debug', 'error', 'dir', 'info'],
});

Vue.use(VueLodash);
sync(store, router);

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
