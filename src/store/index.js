import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import app from './modules/app/index';
import dialogs from './modules/dialogs/index';
import api from './modules/api/index';
import plugins from './plugins';


Vue.use(Vuex);


if (process.env.NODE_ENV !== 'production') {
  plugins.push(createLogger());
}

export default new Vuex.Store({
  modules: {
    app,
    dialogs,
    api,
  },
  plugins,
  strict: false,
});


export const STORAGE_KEY = 'MetaDataEditor';
export const SESSION_ID = `SESSION_${Date.now().valueOf().toString(36)}`;
