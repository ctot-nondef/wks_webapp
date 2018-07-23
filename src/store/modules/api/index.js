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
  setSchema(s, {type, attributes}) {
    if (type && attributes) {
      s.schemas[type] = attributes;
    }
  },
};

const actions = {
  init({ state, commit }) {
    commit('setLoading', 'Loading Database Configuration.');
    state.apilib.get().then((res) => {
      if(res.data.data && res.data.data.length > 0) {
        let sa = res.data.data;
        for (var i = 0; i < sa.length; i++) {
          commit('setSchema', sa[i]);
        }
        commit('setLoadingFinished');
      }
    })
  },
  get({ state, commit }, {type, id, sort, skip, limit, query, populate}) {
    let p = {};
    return new Promise((resolve, reject) => {
      if(type && id) p = state.apilib[`get${type}ByID`]({id});
      else if (type && !id) p = state.apilib[`get${type}`]({sort, skip, limit, query, populate});
      else reject('Invalid or Insufficient Parameters');
      p.then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
    });
  },
  post({ state, commit }, {type, id, body}) {
    let p = {};
    return new Promise((resolve, reject) => {
      if(type && id) p = state.apilib[`post${type}ByID`]({id,[type]:body});
      else if (type && !id) p = state.apilib[`post${type}`]({[type]:body});
      else reject('Invalid or Insufficient Parameters');
      p.then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
    });
  },
  delete({ state, commit }, {type, id}) {
    let p = {};
    return new Promise((resolve, reject) => {
      if(type && id) p = state.apilib[`delete${type}ByID`]({id});
      else if (type && !id) p = state.apilib[`delete${type}`]();
      else reject('Invalid or Insufficient Parameters');
      p.then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
    });
  },
};


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
