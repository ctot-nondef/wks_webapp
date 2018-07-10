import axios from 'axios';
// import exampleAPI from '../../static/example_api.json';
// import exampleAPI from '../../static/newsletter.json';

/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint-disable spaced-comment */
// this could go to an external file, to be excluded from commits etc
const CONFIG = {
  WKS: {
    BASEURL: 'https://wksgoose.eos.arz.oeaw.ac.at/api/v1/',
    ENDPOINTS: {
      JSONSCHEMA: 'jsonschema/',
      BASE: '/'
    },
    TIMEOUT: 15000,
    PARAMS: {
      _format: 'json',
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

const VALID_TYPES = {
  WKS: [
    'PERSONS',
    'ORGANISATIONS',
    'PLACES',
    'CONCEPTS',
    'PUBLICATIONS',
    'METADATA',
  ],
};

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
    loginReq(username, password) {
      this.$info('Helpers', 'login', username);
      return APIS.WKS.BASE.post(`/login`, {username: username, password: password}).then(response => Promise.resolve(response.data));
    },
    logoutReq(username, password) {
      this.$info('Helpers', 'logout');
      return APIS.WKS.BASE.get(`/logout`).then(response => Promise.resolve(response.data));
    },
    /* fetches the JSON-schema from the specified API in the config and returns it.
     */
    getMetadataByType(type) {
      this.$info('Helpers', 'getMetadataByType(type)', type);
      return APIS.ARCHE2.METADATA.get(`${type}/en`).then(response => Promise.resolve(response.data));
    },
    keyInValidTypes(k, subType) {
      //  this.$info('Helpers', 'keyInValidTypes(key, obj)', k, obj);
      //  const key = k.trim();
      return VALID_TYPES[subType].indexOf(k) >= 0;
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
      }
      this.$log('errortree, no id');
      return Promise.reject('no ID was given');
    },
    getArchePromise(id, typ) {
      const type = typ.toUpperCase().trim();
      this.$info('Helpers', 'getArchePromise(id, type)', id, type);
      return APIS.ARCHE[type].get(`${id}`);
    },
    isIdentifier(id) {
      if (id) {
        return APIS.ARCHE2.ID.get(`${id}`).then((response) => {
          this.$log('response', response.data);
          return Promise.resolve(response.data.title ? response.data : false);
        });
      }
      return Promise.reject('no identifier were given');
    },
    getArcheByID(id, typ) {
      const type = typ.toUpperCase().trim();
      this.$info('Helpers', 'getArcheByID(id, type)', id, type);
      if (id && type && APIS.ARCHE2[type]) {
        return APIS.ARCHE2[type].get(`${id}`).then((response) => {
          this.$log('response', response.data);
          return Promise.resolve(response.data);
        }, (error) => {
          this.$log('errortree, request failed', error);
          return Promise.reject(error);
        });
      }
      return Promise.reject('no ID or Type was given');
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
    getMultipleApiCallsByTypeAndID(id, typ) {
      let type = typ.toUpperCase().trim();
      this.$info('Helpers', 'getMultipleApiCallsByTypeAndID(id, type)', id, type);
      if (!id || !typ) {
        return Promise.reject('no ID or Type was given');
      }
  /*    if (id && type && APIS.ARCHE[type]) {
        return this.getArcheByID(id, type);
      } */
      type = type.toLowerCase();
      if (!(id && type && RANGE_TO_APICALLS[type])) {
        return Promise.reject('Failed');
      }
      const range = RANGE_TO_APICALLS[type];
      // this.$debug('more than one: type, id, range: ', type, id, range);
      // concat all the apicalls.
      const calls = [];
      if (range === 'ARCHE_ALL') {
        const ArcheKeys = Object.keys(APIS.ARCHE);
        for (let i = 0; i < ArcheKeys.length; i += 1) {
          // this.$debug('push in:', APIS.ARCHE[ArcheKeys[i]]);
          calls.push(APIS.ARCHE[ArcheKeys[i]].get(`${id}`).catch(this.useNull));
        }
      } else {
        const childs = Object.keys(range);
        for (let i = 0; i < childs.length; i += 1) {
          const apis = range[childs[i]];
          for (let j = 0; j < apis.length; j += 1) {
            /*
              this.$debug(
                'APIS,
                childs[i],
                apis[j],
                APIS[childs[i]][apis[j]]',
                APIS, childs[i],
                apis[j],
                APIS[childs[i]][apis[j]]);
            */
            let p;
            switch (childs[i]) {
              case 'ARCHE':
                p = this.getArchePromise(id, apis[j]);
                break;
              case 'VOCABS':
                p = this.getVocabsPromise(id, apis[j]);
                break;
              default:
                break;
            }
            calls.push(p.catch(this.useNull));
          }
        }
        // this.$debug('dynamic calls is:', calls);
      }
      // this.$debug('calls is: ', calls);

      return axios.all(calls).then((res) => {
        this.$debug('res then', res);
        const data = [];
        for (let i = 0; i < res.length; i += 1) {
          this.$debug('res[i]', res[i]);
          if (res[i] !== null) {
            const o = res[i];
            if (o.data.results) {
              for (let j = 0; j < o.data.results.length; j += 1) {
                const item = o.data.results[j];
                item.type = this.urlToType(o.config.baseURL);
                data.push(item);
              }
            } else {
              for (let j = 0; j < o.data.length; j += 1) {
                const item = o.data[j];
                item.type = this.urlToType(o.config.baseURL);
                data.push(o.data[j]);
              }
            }
          }
        }
        return Promise.resolve(data);
      })
        .catch((res) => {
          console.log(this);
          this.$debug('res failed', res);
          return Promise.reject('Failed');
        });
    },
    useNull() {
      return null;
    },
    urlToType(url) {
      const urlA = url.split('/');
      for (let i = urlA.length - 1; i >= 0; i -= 1) {
        const val = urlA[i];
        if (val && val !== undefined && val !== 'search') {
          return val;
        }
      }
      return 'not_found';
    },
    typeicon(typ) {
      if (typ) {
        const type = typ.toUpperCase();
        switch (type) {
          case 'X':
            return 'highlight_off';
          case 'check':
            return 'check_circle';
          case 'KEYBOARD':
            return 'keyboard';
          case 'https://vocabs.acdh.oeaw.ac.at/schema#Resource':
            return 'developer_board';
          case 'PERSONS':
          case 'persons':
          case 'https://vocabs.acdh.oeaw.ac.at/schema#Persons':
            return 'person';
          case 'PLACES':
          case 'https://vocabs.acdh.oeaw.ac.at/schema#Place':
            return 'place';
          case 'ORGANISATIONS':
          case 'https://vocabs.acdh.oeaw.ac.at/schema#Organisation':
            return 'device_hub';
          case 'ARCHE_CATEGORY':
            return 'folder_open';
          case 'ARCHE_LIFECYCLE_STATUS':
            return 'donut_large';
          default: return 'folder';
        }
      }
      return 'folder';
    },
    /*

    agent:  { ARCHE: ['ARCHE', 'PERSONS'] },
    containerorreme: 'ARCHE_ALL',
    containerorresource: 'ARCHE_ALL',
    main: 'ARCHE_ALL',
    publicationorrepoobject: { ARCHE: ['PUBLICATIONS'] },
    repoobject: 'ARCHE_ALL',
    anyuri: 'ARCHE_ALL',

    */
    setInitialData(err, key, post) {
      this.$info('Helpers', 'setInitialData(err, key, post)', err, key, post);
      if (err) {
        this.error = err.toString();
      } else {
        this[key] = post;
      }
    },
    filterModelBeforeUpload(model) {
      this.$info('Helpers', 'filterModelBeforeUpload(model)', model);
      const m = JSON.parse(JSON.stringify(model));
      const keys = Object.keys(model);
      const vals = Object.values(model);
      this.$log(keys, vals, m);
      for (let i = 0; i < keys.length; i += 1) {
        if ((typeof vals[i]).toLowerCase() === 'object') {
          m[keys[i]] = this.filterForArcheID(vals[i]);
        }
      }
      return m;
    },

         /*
    copies the value of range to the position of type. and returns the model.
    * @param schema schema object obtained form the api via getMetadataByType()
    * @param type if type === 'only name' only the name of the range is taken.
    *             eg. "https://vocabs.acdh.oeaw.ac.at/schema#ContainerOrResource" -> ContainerOrResource"
    **/
    copyRangeToType(schema, type) {
      this.$info('Helpers', 'copyRangeToType(model, type)', schema, type);
      if (!schema) {
        return {};
      }
      const m = schema; // to be returned

      const keys = Object.keys(schema.properties);

      // debug object, lists all types
      const types = {};

      this.$log(keys, schema);
      for (let i = 0; i < keys.length; i += 1) {
        if (!m.properties[keys[i]].attrs) m.properties[keys[i]].attrs = {};
        if (m.properties[keys[i]].range) {
          console.log(m.properties[keys[i]]);
          let r = m.properties[keys[i]].range;
          if (type === 'only name') {
            r = r.substring(r.lastIndexOf('#') + 1);
            m.properties[keys[i]].attrs.type = r;
          } else {
            m.properties[keys[i]].attrs.type = r;
          }
          if (types[r]) {
            types[r] += 1;
          } else {
            types[r] = 1;
          }
        }
      }
      // this.$debug('FMFT: valid types:', types);
      return m;
    },
    filterForArcheID(obj) {
      this.$info('Helpers', 'filterForArcheID(obj)', obj);
      if (obj.identifiers) {
        return obj.identifiers.filter(str => str.indexOf('https://id.acdh.oeaw.ac.at') > -1)[0];
      }
      return obj;
    },
    // Store Functions
    getLatestSession() {
      let localStorage;
      try {
        localStorage = window.localStorage;
      } catch (e) {
        // Access denied :-(
        return e;
      }
      let latest = {
        date: -1,
      };
      let sessions = {};
      let sessionVals = {};
      try {
        sessions = Object.keys(JSON.parse(localStorage.MetaDataEditor));
        sessionVals = Object.values(JSON.parse(localStorage.MetaDataEditor));
      } catch (e) {
        return null;
      }
      for (let i = 0; i < sessions.length; i += 1) {
        console.log(Date.now() - sessionVals[i].date);
        // second contition is to catch the newly made session.
        if (sessionVals[i].date > latest.date && Date.now() - sessionVals[i].date > 50) {
          latest = sessionVals[i];
        }
      }
      if (latest.date === -1) {
        latest = null;
      }
      return latest;
    },
    deleteOldSessions() {
      let localStorage;
      try {
        localStorage = window.localStorage;
      } catch (e) {
        // Access denied :-(
        return e;
      }
      try {
        localStorage.setItem('MetaDataEditor', '');
      } catch (e) {
        return null;
      }
      return null;
    },
    clearCache() {
      this.deleteOldSessions();
      this.$router.go(this.$router.currentRoute);
    },
    stringToBlob(str) {
      return new Blob([str], {
        type: 'text/ttl;',
      });
    },
    dateToString(date) {
      const y = date.getFullYear() - 2000;
      let m;
      if (date.getMonth() < 10) {
        m = '0'.toString() + (date.getMonth() + 1);
      } else {
        m = date.getMonth() + 1;
      }
      let d;
      if (date.getDate() < 10) {
        d = '0'.toString() + date.getDate();
      } else {
        d = date.getDate();
      }
      return `${d}/${m}/${y} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    },
    clearStore() {
      this.$info('clearStore');
      this.clearCache();
    },
    IconByRepoType(uri) {
      switch (uri) {
        case 'https://vocabs.acdh.oeaw.ac.at/schema#Collection':
          return 'folder';
        case 'https://vocabs.acdh.oeaw.ac.at/schema#Resource':
          return 'developer_board';
        case 'PERSONS':
        case 'https://vocabs.acdh.oeaw.ac.at/schema#Person':
          return 'person';
        case 'PLACES':
        case 'https://vocabs.acdh.oeaw.ac.at/schema#Place':
          return 'place';
        case 'ORGANISATIONS':
        case 'https://vocabs.acdh.oeaw.ac.at/schema#Organisation':
          return 'device_hub';
        default:
          return 'folder';
      }
    },
    saveEntry() {
      this.$info('FormFromSchema', 'saveEntry');
      this.setEntry({ name: this.uniqueName, entry: this.model });
    },
  },
  created() {
    this.$info('Helpers', 'created');
  },
};
