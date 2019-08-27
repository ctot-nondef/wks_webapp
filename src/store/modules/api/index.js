/* eslint-disable no-shadow */
import * as api from './api';

function PopulateablePathsFromSchemaObject(vm, schema, path) {
  let p = [];
  let t = '';
  if (path.length > 0) t = vm._.get(schema, path).type;
  else t = schema.type;
  if (t === 'object') {
    Object.keys(vm._.get(schema, path.concat(['properties']))).forEach((cp) => {
      p = p.concat(PopulateablePathsFromSchemaObject(vm, schema, path.concat(['properties', cp])));
    });
  } else if (t === 'array') {
    if (vm._.get(schema, path.concat(['items'])).type === 'string' && vm._.get(schema, path.concat(['items']))['x-ref']) {
      p.push(path.filter(a => (a !== 'properties' && a !== 'items')).join('.'));
    } else if (vm._.get(schema, path.concat(['items'])).type === 'object') {
      Object.keys(vm._.get(schema, path.concat(['items', 'properties']))).forEach((cp) => {
        p = p.concat(PopulateablePathsFromSchemaObject(vm, schema, path.concat(['items', 'properties', cp])));
      });
    }
  } else if (t === 'string' && vm._.get(schema, path)['x-ref']) {
    p.push(path.filter(a => (a !== 'properties' && a !== 'items')).join('.'));
  }
  return p;
}

function computeFieldType(vm, entity, field) {
  console.log(vm, entity, field);
  return 'text';
}

const state = {
  apilib: {},
  init: false,
  url: '',
  user: {},
  token: null,
  loadmsg: '',
  schemas: {},
  ppaths: {},
  classes: {},
  page: 1,
  size: 50,
  p: ['user', 'token'],
};

const $config = {
  withCredentials: true,
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
  getFieldType: s => ({ type, name }) => computeFieldType(this, type, name),
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
  setPopulateablePaths(s, { type, paths }) {
    if (type && paths) {
      s.ppaths[type] = paths;
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
  init({ state, commit, getters }, config) {
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
            commit('setPopulateablePaths', { type: sa[i].type, paths: PopulateablePathsFromSchemaObject(config.vm, sa[i].attributes, []) });
          }
        }
      }),
      state.apilib.getDescriptor({
        $config,
        query: JSON.stringify({
          description: 'Class of Actor',
        }),
      }).then((res) => {
        commit('setClasses', { type: 'Actor', classlist: res.data });
      }),
      state.apilib.getDescriptor({
        $config,
        query: JSON.stringify({
          description: 'Class of Descriptor',
        }),
      }).then((res) => {
        commit('setClasses', { type: 'Descriptor', classlist: res.data });
      }),
    );
    return Promise.all(p).then(() => {
      commit('setLoadingFinished');
      commit('setInit');
    });
  },
  get({ state, commit }, { type, id, sort, skip, limit, query, populate }) {
    let p = {};
    const t = type.charAt(0).toUpperCase() + type.slice(1);
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
