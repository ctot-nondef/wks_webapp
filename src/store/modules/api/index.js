/* eslint-disable no-shadow,no-underscore-dangle */
import Swagger from 'swagger-client';

function computeFieldType(field, name) {
  if(field) {
    if (name === 'instanceOf') return `class_${field['x-ref']}`;
    if (field.type === 'array') return computeFieldType(field.items);
    if (field.type === 'string' && field['x-ref']) return `xref_${field['x-ref']}`;
    if (field.type === 'string' && field.format) return field.format;
    return field.type;
  }
  return '';
}

function cleanFilter(f) {
  const cf = {};
  Object.keys(f).forEach((key) => {
    if (typeof f[key] === 'string' && f[key] !== '' && f[key] !== null) cf[key] = f[key];
    else if (typeof f[key] === 'object' && f[key] !== null) {
      ['$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$regex', '$size'].forEach((op) => {
        if (f[key][op] && f[key][op] !== '' && f[key][op] !== null) cf[key] = f[key];
      });
      if (f[key]._id) cf[key] = f[key];
      if (key.match(/^(\$and|\$or|\$not|\$nor)$/) && f[key].length > 0) cf[key] = f[key];
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

const $config = {
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'cache-control': 'no-cache, must-revalidate, post-check=0, pre-check=0',
    'pragma': 'no-cache',
  },
};

const state = {
  apiclient: {},
  init: false,
  url: '',
  loggedin: false,
  user: {},
  token: null,
  refreshtoken: null,
  loadmsg: '',
  schemas: {},
  ppaths: {},
  rpaths: {},
  classes: {},
  page: 1,
  size: 50,
  p: ['user', 'token', 'loggedin', 'refreshtoken'],
  listheaders: {},
  filters: {},
};

/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint-disable no-underscore-dangle */
const getters = {
  getClient: s => s.apiclient.apis,
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
  setApiClient(s, client) {
    s.apiclient = client;
  },
  setApiURL(s, url) {
    s.url = `${url}/api/v1`;
  },
  setState(s, pstate) {
    Object.keys(pstate).forEach((key) => {
      if (pstate[key] !== undefined && s[key] !== undefined) s[key] = pstate[key];
    });
  },
  loginMut(s, { token, refreshtoken, user }) {
    s.token = token;
    s.refreshtoken = refreshtoken;
    s.user = user;
    s.loggedin = true;
    s.apiclient.authorizations.bearer = token;
  },
  updateToken(s, t) {
    s.token = t;
    s.apiclient.authorizations.bearer = t;
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
  async init({ state, commit, dispatch }, config) {
    const APIClient = await Swagger(
        `${config.config.api}/api/v1/swagger-json`,
        {
          authorizations: { bearer: state.token },
        });
    commit('setApiClient', APIClient);
    commit('setApiURL', config.config.api);
    if (config.pstate !== null && config.pstate.pState.api) commit('setState', config.pstate.pState.api);
    await dispatch('refreshtoken');
    commit('setLoading', 'Loading Database Configuration.');
    const p = [];
    p.push(
      state.apiclient.apis.Root.SchemasController_apiroot({ $config }).then((res) => {
        if (res.body.data && res.body.data.length > 0) {
          const sa = res.body.data;
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
      state.apiclient.apis.descriptor.get_api_v1_descriptor({
        $config,
        query: JSON.stringify({ description: 'Class of Actor' }),
      }).then((res) => {
        commit('setClasses', { type: 'Actor', classlist: res.body });
      }),
      // TODO: this should probably go to a separate store once the thesaurus is SKOS compatible
      state.apiclient.apis.descriptor.get_api_v1_descriptor({
        $config,
        query: JSON.stringify({ description: 'Class of Descriptor' }),
      }).then((res) => {
        commit('setClasses', { type: 'Descriptor', classlist: res.body });
      }),
    );
    return Promise.all(p).then(() => {
      commit('setLoadingFinished');
      commit('setInit');
    });
  },
  refreshtoken({ state, commit }) {
    //TODO check actual token expiry date
    state.apiclient.apis.User.UserController_refreshAccessToken(
        null,
        {
          requestBody: {
            "refreshToken": state.refreshtoken
          }
        }
    ).then((res) => {
      commit('updateToken', res.body.accessToken);
      return res.body.accessToken;
    }).catch(() => {
      console.log('logon expired');
      commit('logoutMut');
      return false;
    });
  },
  async get({ state, commit, dispatch }, { type, id, sort, skip, limit, query, populate }) {
    console.log(query);
    // eslint-disable-next-line no-param-reassign
    type = type.toLowerCase();
    await dispatch('refreshtoken');
    let p = {};
    // eslint-disable-next-line no-param-reassign
    if(!sort) sort = 'name';
    return new Promise((resolve, reject) => {
      if (type && id) {
        commit('setLoading', `Getting ${type} ${id} from Database`);
        p = state.apiclient.apis[type.toLowerCase()][`get_api_v1_${type}__id_`]({ id, $config, populate });
      } else if (type && !id) {
        commit('setLoading', `Getting Queryset of ${type} from Database`);
        p = state.apiclient.apis[type][`get_api_v1_${type}`]({ sort, skip, limit, query: cleanFilter(query), populate, $config });
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
  async post({ state, commit, dispatch, getters }, { type, id, body }) {
    // eslint-disable-next-line no-param-reassign
    type = type.toLowerCase();
    await dispatch('refreshtoken');
    let p = {};
    const params = {
      $config,
    };
    params[type] = deleteProps(body, getters.getReversePathsByName(type));
    params.id = id;
    return new Promise((resolve, reject) => {
      if (type && id) {
        commit('setLoading', `Updating ${type} ${id} to Database`);
        p = state.apiclient.apis[type][`post_api_v1_${type}__id_`](
            { id },
            { requestBody: params[type] },
        );
      } else if (type && !id) {
        commit('setLoading', `Creating a ${type} in Database`);
        p = state.apiclient.apis[type][`post_api_v1_${type}`](
            null,
            { requestBody: params[type] },
        );
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
  async delete({ state, commit, dispatch }, { type, id }) {
    // eslint-disable-next-line no-param-reassign
    type = type.toLowerCase();
    await dispatch('refreshtoken');
    let p = {};
    return new Promise((resolve, reject) => {
      if (type && id) {
        commit('setLoading', `Deleting ${type} ${id} in Database`);
        p = state.apiclient.apis[type][`delete_api_v1_${type}__id_`](
            { id },
        );
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
  async search({ state, commit, dispatch }, { type, sort, skip, limit, query }) {
    await dispatch('refreshtoken');
    let facets = deleteProps(query, ['fti', 'operator']);
    console.log(facets);
    let p = {};
    // eslint-disable-next-line no-param-reassign
    if(!sort) sort = 'name';
    return new Promise((resolve, reject) => {
      if (type && query && query.fti) {
        commit('setLoading', `Searching ${type} with ${query.fti} from Database`);
        p = state.apiclient.apis.Root.SchemasController_search({ type, $config, sort, skip, limit, query: query.fti, operator: query.operator, facets: JSON.stringify(facets) });
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
