import * as api from './api';

api.setDomain('https://wksgoose.eos.arz.oeaw.ac.at/api/v1');


const state = {
  apilib: api,
  loading: false,
  loadmsg: '',
  schemas: {},

};

/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint-disable no-underscore-dangle */
const getters = {
  availableEndpoints: s => s.apilib.keys,
  f: s => name => s.apilib[name],
  schema: s => name => s.schemas[name],
  types: s => s.schemas.keys
};

const mutations = {
  setConfig(s, config) {
    s.config = config;
  },
  setLoading(s, msg) {
    s.loading = true;
    s.loadmsg = msg;
  },
  setLoadingFinished(s) {
    s.loading = false;
    s.loadmsg = '';
  },
  setSchema(s, schema) {
    if (schema.type && schema.attributes) {
      s.schemas[schema.type] = schema.attributes;
    }
  },
};

const actions = {
  init({ state, commit }) {
    state.apilib.get().then((res) => {
      if(res.data.data && res.data.data.length > 0) {
        let sa = res.data.data;
        for (var i = 0; i < sa.length; i++) {
          commit('setSchema', sa[i]);
        }
        console.log(state);
      }
    })
  },
};


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
