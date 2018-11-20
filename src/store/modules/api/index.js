import * as api from './api';

api.setDomain('https://wksgoose.acdh-dev.oeaw.ac.at/api/v1');


const state = {
  apilib: api,
  user: '',
  token: null,
  loading: false,
  loadmsg: '',
  schemas: {},
  classes: {},
  page: 1,
  size: 50,
  p: ['user', 'token'],
};

const $config = {
  withCredentials: true
};

/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint-disable no-underscore-dangle */
const getters = {
  availableEndpoints: s => s.apilib.keys,
  f: s => name => s.apilib[name],
  schema: s => name => s.schemas[name],
  types: s => s.schemas.keys,
};

const mutations = {
  setConfig(s, config) {
    s.config = config;
  },
  setState(s, pstate) {
    for (const key in pstate) {
      if (pstate.hasOwnProperty(key) && s.hasOwnProperty(key)) s[key] = pstate[key];
    }
  },
  setToken(s, { token, user }) {
    s.token = token;
    s.user = user;
  },
  setPage(s, page) {
    s.page = page;
  },
  setSize(s, size) {
    s.size = size;
  },
  setLoading(s, msg) {
    s.loading = true;
    s.loadmsg = msg;
  },
  setLoadingFinished(s) {
    s.loading = false;
    s.loadmsg = '';
  },
  setSchema(s, { type, attributes }) {
    if (type && attributes) {
      s.schemas[type] = attributes;
    }
  },
  setClasses(s, { type, classlist }) {
    if (type && classlist) {
      s.classes[type] = classlist;
    }
  },
};

const actions = {
  init({ state, commit }, pstate) {
    if (pstate.pState.api) commit('setState', pstate.pState.api);
    commit('setLoading', 'Loading Database Configuration.');
    state.apilib.get( { $config } ).then((res) => {
      if (res.data.data && res.data.data.length > 0) {
        const sa = res.data.data;
        for (let i = 0; i < sa.length; i++) {
          commit('setSchema', sa[i]);
        }
        commit('setLoadingFinished');
      }
    });
    state.apilib.getDescriptor({
      $config,
      type: 'Descriptor',
      query: JSON.stringify({
        description: "Class of Actor",
      }),
    }).then((res) => {
      commit('setClasses', { type: 'Actor', classlist: res.data});
    });
    state.apilib.getDescriptor({
      $config,
      type: 'Descriptor',
      query: JSON.stringify({
        description: "Class of Descriptor",
      }),
    }).then((res) => {
      commit('setClasses', { type: 'Descriptor', classlist: res.data});
    });
  },
  get({ state, commit }, { type, id, sort, skip, limit, query, populate }) {
    let p = {};
    let t = type.charAt(0).toUpperCase() + type.slice(1);
    return new Promise((resolve, reject) => {
      if (type && id) {
        commit('setLoading', `Getting ${type} ${id} from Database`);
        p = state.apilib[`get${t}ById`]({ id, $config, populate });
      } else if (type && !id) {
        commit('setLoading', `Getting Queryset of ${type} from Database`);
        p = state.apilib[`get${t}`]({ sort, skip, limit, query, populate, $config });
      } else reject('Invalid or Insufficient Parameters');
      p.then((res) => {
        commit('setLoadingFinished');
        resolve(res);
      })
      .catch((error) => {
        commit('setLoadingFinished');
        reject(error);
      });
    });
  },
  post({ state, commit }, { type, id, body }) {
    let p = {};
    let params = {
      $config
    }
    params[type] = body;
    params.id = id;
    let t = type.charAt(0).toUpperCase() + type.slice(1);
    return new Promise((resolve, reject) => {
      if (type && id) {
        commit('setLoading', `Updating ${type} ${id} to Database`);
        p = state.apilib[`post${t}ById`](params);
      } else if (type && !id) {
        commit('setLoading', `Creating a ${type} in Database`);
        p = state.apilib[`post${t}`](params);
      } else reject('Invalid or Insufficient Parameters');
      p.then((res) => {
        commit('setLoadingFinished');
        resolve(res);
      })
      .catch((error) => {
        commit('setLoadingFinished');
        reject(error);
      });
    });
  },
  delete({ state, commit }, { type, id }) {
    let p = {};
    let t = type.charAt(0).toUpperCase() + type.slice(1);
    return new Promise((resolve, reject) => {
      if (type && id) {
        commit('setLoading', `Deleting ${type} ${id} in Database`);
        p = state.apilib[`delete${t}ById`]({ id });
      } else reject('Invalid or Insufficient Parameters');
      p.then((res) => {
        commit('setLoadingFinished');
        resolve(res);
      })
      .catch((error) => {
        commit('setLoadingFinished');
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
  actions,
};
