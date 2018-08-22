import axios from 'axios';
// import exampleAPI from '../../static/example_api.json';
// import exampleAPI from '../../static/newsletter.json';

/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint-disable spaced-comment */
// this could go to an external file, to be excluded from commits etc
const CONFIG = {
  WKS: {
    BASEURL: 'https://wksgoose.hephaistos.arz.oeaw.ac.at/api/v1/',
    ENDPOINTS: {
      BASE: '/',
    },
    TIMEOUT: 15000,
    PARAMS: {},
    HEADERS: {},
  },
  ADLIB: {
    BASEURL: 'http://kgunivie.w07adlibdb1.arz.oeaw.ac.at',
    ENDPOINTS: {
      BASE: '/wwwopac.ashx',
    },
    TIMEOUT: 15000,
    PARAMS: {
      output: 'json',
      action: 'search',
      limit: '1000',
    },
    HEADERS: {},
  },
  VIAF: {
    BASEURL: 'https://www.viaf.org/viaf/',
    ENDPOINTS: {
      BASE: '',
      SEARCH: 'search',
    },
    TIMEOUT: 5000,
    PARAMS: {
      httpAccept: 'application/json',
    },
    HEADERS: {},
  },
  VOCABS: {
    BASEURL: 'https://vocabs.acdh.oeaw.ac.at/rest/v1/',
    ENDPOINTS: {
      ARCHE_CATEGORY: 'arche_category/search/',
      ARCHE_LIFECYCLE_STATUS: 'arche_lifecycle_status/search/',
    },
    TIMEOUT: 5000,
    PARAMS: {
    },
    HEADERS: {},
  },
};

let APIS = {};

function buildFetchers(extconf) {
  // this.$info('Helpers', 'buildFetchers(extconf)', extconf);
  const fetchers = {};
  // let ep = [];
  if (extconf) Object.assign(CONFIG, extconf);
  const c = Object.keys(CONFIG);
  let idx = c.length - 1;
  while (idx + 1) {
    const d = Object.keys(CONFIG[c[idx]].ENDPOINTS);
    let idy = d.length - 1;
    fetchers[c[idx]] = {};
    while (idy + 1) {
      fetchers[c[idx]][d[idy]] = axios.create({
        baseURL: CONFIG[c[idx]].BASEURL + CONFIG[c[idx]].ENDPOINTS[d[idy]],
        timeout: CONFIG[c[idx]].TIMEOUT,
        params: CONFIG[c[idx]].PARAMS,
        headers: CONFIG[c[idx]].HEADERS,
      });
      idy -= 1;
    }
    idx -= 1;
  }
  return fetchers;
}

APIS = buildFetchers();

export default {
  data() {
    return {
      APIS,
    };
  },
  methods: {
    getAdlibRecordByID(db, id) {
      this.$info('Helpers', 'getAdlibRecordByID', db, id);
      if (db && id) {
        return APIS.ADLIB.BASE.get('', {
          params: {
            database: db,
            search: `priref=${id}`,
          },
        }).then((response) => {
          this.$log('response', response.data);
          return Promise.resolve(response.data);
        }, (error) => {
          this.$log('errortree, request failed', error);
          return Promise.reject(error);
        });
      }
      return Promise.reject('no ID was given');
    },
    getAdlibRecordsByQuery(db, query) {
      this.$info('Helpers', 'getAdlibRecordByQuery', db, query);
      if (db && query) {
        return APIS.ADLIB.BASE.get('', {
          params: {
            database: db,
            search: query,
          },
        }).then((response) => {
          this.$log('response', response.data);
          return Promise.resolve(response.data);
        }, (error) => {
          this.$log('errortree, request failed', error);
          return Promise.reject(error);
        });
      }
      return Promise.reject('no ID was given');
    },
    getViafByID(id) {
      this.$info('Helpers', 'getViafByID(id)', id);

      if (id) {
        return APIS.VIAF.BASE.get(`${id}/`).then((response) => {
          this.$log('response', response.data);
          return Promise.resolve(response.data);
        }, (error) => {
          this.$log('errortree, request failed', error);
          return Promise.reject(error);
        });
      } else {
        this.$log('errortree, no id');
        return Promise.reject('no ID was given');
      }
    },
    getVocabsPromise(id, typ) {
      const type = typ.toUpperCase();
      this.$info('Helpers', 'getVocabsPromise(id, type)', id, type);
      return APIS.VOCABS[type].get('', {
        params: {
          query: `${id}*`,
        },
      });
    },
    getVocabsByID(id, typ) {
      const type = typ.toUpperCase();
      this.$info('Helpers', 'getVocabsByID(id, type)', id, type);
      if (id && type && APIS.VOCABS[type]) {
        return APIS.VOCABS[type].get('', {
          params: {
            query: `${id}*`,
          },
        }).then((response) => {
          this.$log('response', response);
          return Promise.resolve(response.data);
        }, (error) => {
          this.$log('errortree, request failed', error);
          return Promise.reject(error);
        });
      }
      return Promise.reject('failed to recieve vocabs');
    },
    splitToGetMultipleCalls(id, typ) {
      this.$info('Helpers', 'splitToGetMultipleCalls(id, type)', id, typ);
      if (typ.indexOf('Or') === -1) {
        return this.getMultipleApiCallsByTypeAndID(id, typ);
      }
      const typen = typ.split('Or');
      const promises = [];
      for (let i = 0; i < typen.length; i += 1) {
        promises.push(this.getMultipleApiCallsByTypeAndID(id, typen[i]).catch(this.useNull));
      }
      return Promise.all(promises).then((res) => {
        // this.$debug('res All promises', res);
        const data = [];
        for (let i = 0; i < res.length; i += 1) {
          if (res[i] !== null) {
            const o = res[i];
            for (let j = 0; j < o.length; j += 1) {
              data.push(o[j]);
            }
          }
        }
        // this.$debug('Data', data);
        return Promise.resolve(data);
      })
      .catch((res) => {
        Promise.reject('Could not receive data', res);
      });
    },
    mapRecord(source, target, record) {
      let t = {};
      const map = [`${source}_${target}`];
      const keys = Object.keys(map);
      console.log(map, keys, record);
      for (let i = 0; i < keys.length; i++) {
        if (record[keys[i]] && map[keys[i]].split('_').length === 1) {
          t[map[keys[i]]] = record[keys[i]];
        } else if (record[keys[i]] && map[keys[i]].split('_')[1] === '0') {
          t[map[keys[i]].split('_')[0]] = record[keys[i]][0];
        } else if (record[keys[i]] && map[keys[i]].split('_')[1] && map[keys[i]].split('_')[1] !== '0') {
          t[map[keys[i]].split('_')[0]] = `${map[keys[i]].split('_')[1]}_${record[keys[i]]}`;
        }
      }
      return t;
    },
  },
  created() {
    this.$info('Helpers', 'created');
  },
};
