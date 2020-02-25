/* eslint-disable no-shadow,no-underscore-dangle */
import * as api from './api';

function computeFieldType(field, name) {
  if (name === 'instanceOf') return `class_${field['x-ref']}`;
  if (field.type === 'array') return computeFieldType(field.items);
  if (field.type === 'string' && field['x-ref']) return `xref_${field['x-ref']}`;
  if (field.type === 'string' && field.format) return field.format;
  return field.type;
}

function cleanFilter(f) {
  const cf = {};
  Object.keys(f).forEach((key) => {
    if (typeof f[key] === 'string' && f[key] !== '' && f[key] !== null) cf[key] = f[key];
    if (typeof f[key] === 'object' && f[key] !== null) {
      ['$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$regex'].forEach((op) => {
        if (f[key][op] && f[key][op] !== '' && f[key][op] !== null) cf[key] = f[key];
      });
      if (f[key]._id) cf[key] = f[key];
    }
  });
  return JSON.stringify(cf);
}

function deleteProps(obj, props) {
  const r = Object.assign({}, obj);
  props.forEach((p) => {
    if (r[p]) delete r[p];
  });
  return r;
}

const state = {
  apilib: {},
  init: false,
  url: '',
  loggedin: false,
  user: {},
  token: null,
  loadmsg: '',
  schemas: {},
  ppaths: {},
  rpaths: {},
  classes: {},
  page: 1,
  size: 50,
  p: ['user', 'token', 'loggedin'],
  listheaders: {},
  filters: {},
};

const $config = {
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'cache-control': 'no-cache, must-revalidate, post-check=0, pre-check=0',
    // 'cache-control': 'max-age=0',
    // 'expires': '0',
    // 'expires': 'Tue, 01 Jan 1980 1:00:00 GMT',
    pragma: 'no-cache',
  },
};

/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint-disable no-underscore-dangle */
const getters = {
  f: s => name => s.apilib[name],
  schema: s => name => s.schemas[name],
  types: s => Object.keys(s.schemas),
  getClassByName: s => ({ type, name }) => s.classes[type].find(item => item.name === name),
  getPathsByName: s => name => s.ppaths[name],
  getReversePathsByName: s => name => s.rpaths[name],
  getListHeadersByName: s => name => s.listheaders[name],
  getFiltersByName: s => name => s.listheaders[name],
  getFieldType: s => ({ type, name }) => computeFieldType(s.schemas[type].properties[name], name),
};

const mutations = {
  setConfig(s, config) {
    s.config = config;
  },
  setApiLib(s, lib) {
    s.apilib = lib;
  },
  setApiURL(s, url) {
    if (s.apilib.setDomain) {
      s.apilib.setDomain(`${url}/api/v1`);
      s.url = url;
    }
  },
  setState(s, pstate) {
    Object.keys(pstate).forEach((key) => {
      if (pstate[key] !== undefined && s[key] !== undefined) s[key] = pstate[key];
    });
  },
  loginMut(s, { token, user }) {
    s.token = token;
    s.user = user;
    s.loggedin = true;
  },
  logoutMut(s) {
    s.token = null;
    s.user = {};
    s.loggedin = false;
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
  setPopulateablePaths(s, { type, paths }) {
    if (type && paths) {
      s.ppaths[type] = paths;
    }
  },
  setReversePopulateablePaths(s, { type, paths }) {
    if (type && paths) {
      s.rpaths[type] = paths;
    }
  },
  setListHeaders(s, { type, headers }) {
    if (type && headers) {
      s.listheaders[type] = headers;
    }
  },
  setFilters(s, { type, filters }) {
    if (type && filters) {
      s.filters[type] = filters;
    }
  },
  setClasses(s, { type, classlist }) {
    if (type && classlist) {
      s.classes[type] = classlist;
    }
  },
  setInit(s) {
    s.init = true;
  },
};

const actions = {
  // eslint-disable-next-line no-shadow
  init({ state, commit }, config) {
    commit('setApiLib', api);
    commit('setApiURL', `${config.config.api}`);
    if (config.pstate !== null && config.pstate.pState.api) commit('setState', config.pstate.pState.api);
    commit('setLoading', 'Loading Database Configuration.');
    const p = [];
    p.push(
      state.apilib.get({ $config }).then((res) => {
        if (res.data.data && res.data.data.length > 0) {
          const sa = res.data.data;
          for (let i = 0; i < sa.length; i += 1) {
            commit('setSchema', sa[i]);
            commit('setPopulateablePaths', { type: sa[i].type, paths: sa[i].populateablePaths.map(p => p.path) });
            commit('setReversePopulateablePaths', { type: sa[i].type, paths: sa[i].reversePaths });
            if (config.config.headers[sa[i].type]) commit('setListHeaders', { type: sa[i].type, headers: config.config.headers[sa[i].type] });
            if (config.config.filters[sa[i].type]) commit('setFilters', { type: sa[i].type, filters: config.config.filters[sa[i].type] });
          }
        }
      }),
      // TODO: this should probably go to a separate store once the thesaurus is SKOS compatible
      state.apilib.getDescriptor({
        $config,
        query: JSON.stringify({ description: 'Class of Actor' }),
      }).then((res) => {
        commit('setClasses', { type: 'Actor', classlist: res.data });
      }),
      // TODO: this should probably go to a separate store once the thesaurus is SKOS compatible
      state.apilib.getDescriptor({
        $config,
        query: JSON.stringify({ description: 'Class of Descriptor' }),
      }).then((res) => {
        commit('setClasses', { type: 'Descriptor', classlist: res.data });
      }),
      state.apilib.getUserCount({ $config }).catch(() => {
        console.log('logon expired');
        commit('logoutMut');
      }),
    );
    return Promise.all(p).then(() => {
      commit('setLoadingFinished');
      commit('setInit');
    });
  },
  get({ state, commit }, { type, id, sort, skip, limit, query, populate }) {
    let p = {};
    // eslint-disable-next-line no-param-reassign
    if(!sort) sort = 'name';
    const t = type.charAt(0).toUpperCase() + type.slice(1);
    return new Promise((resolve, reject) => {
      if (type && id) {
        commit('setLoading', `Getting ${type} ${id} from Database`);
        p = state.apilib[`get${t}ById`]({ id, $config, populate });
      } else if (type && !id) {
        commit('setLoading', `Getting Queryset of ${type} from Database`);
        p = state.apilib[`get${t}`]({ sort, skip, limit, query: cleanFilter(query), populate, $config });
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
  post({ state, commit, getters }, { type, id, body }) {
    let p = {};
    const params = {
      $config,
    };
    params[type] = deleteProps(body, getters.getReversePathsByName(type));
    params.id = id;
    const t = type.charAt(0).toUpperCase() + type.slice(1);
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
  patch({ state, commit }, { type, id, body }) {
    let p = {};
    const params = {
      $config,
    };
    params[type] = body;
    params.id = id;
    const t = type.charAt(0).toUpperCase() + type.slice(1);
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
    const t = type.charAt(0).toUpperCase() + type.slice(1);
    return new Promise((resolve, reject) => {
      if (type && id) {
        commit('setLoading', `Deleting ${type} ${id} in Database`);
        p = state.apilib[`delete${t}ById`]({ id, $config });
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
