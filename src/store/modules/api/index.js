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
  setSchema(s, { name, schema }) {
    if (name && schema) {
      s.schemas[name] = schema;
    }
  },
  setEntry(s, { name, entry }) {
    this._vm.$log(name, entry);
    if (name && entry) {
      s.entries[name] = entry;
    }
    // s.entries = JSON.parse(JSON.stringify(s.entries));
  },
};

const actions = {
  init({ commit }) {

  },
};


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
