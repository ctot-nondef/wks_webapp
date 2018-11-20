import axios from 'axios';
// import exampleAPI from '../../static/example_api.json';
// import exampleAPI from '../../static/newsletter.json';

/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint-disable spaced-comment */
// this could go to an external file, to be excluded from commits etc
const CONFIG = {
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
  GND: {
    BASEURL: 'https://lobid.org/gnd/',
    ENDPOINTS: {
      DIRECT: '',
      SEARCH: 'search',
    },
    TIMEOUT: 5000,
    PARAMS: {
    },
    HEADERS: {
      "Accept":"application/json",
    },
  },
};

const IMPORT = {
  GND: {
    Person: {
      preferredName: "name",
      dateOfBirth: "beginOfExistence",
      dateOfDeath: "endOfExistence",
      biographicalOrHistoricalInformation: "description",
    },
    CorporateBody: {
      preferredName: "name",
      dateOfEstablishment: "beginOfExistence",
      dateOfTermination: "endOfExistence",
    },

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
      IMPORT,
    };
  },
  methods: {
    // Store Functions
    /*
    gets the latest session out of the local storage.
    // TODO: since we currently obly store one session, this function coud be much shorter.
    */
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
        if (sessionVals[i].date > latest.date && Date.now() - sessionVals[i].date > 50) {
          latest = sessionVals[i];
        }
      }
      if (latest.date === -1) {
        latest = null;
      }
      return latest;
    },
    /*
    deletes the whole local Storage of the key 'MetaDataEditor'.
    // TODO: the key is currently hardcoded. should be imported from some config.
    */
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
    /*
    deletes * from the local storage
    and reroutes to the current page in order do clear the vuex Storage.
    */
    clearCache() {
      this.deleteOldSessions();
      this.$router.go(this.$router.currentRoute);
    },
    /*
    maps imported Object according to mapping in this.IMPORT
    returns mapped object for DB
    */
    mapGNDImport(type, obj) {
      console.log(this.IMPORT.GND[type]);
      let map = Object.keys(this.IMPORT.GND[type]);
      let idx = map.length - 1;
      let res = {};
      while(idx + 1) {
        res[this.IMPORT.GND[type][map[idx]]] = obj[map[idx]];
        idx -= 1;
      }
      res.identifier = [`GND:${obj.gndIdentifier}`];
      return res;
    },
  },
  created() {
    this.$info('Helpers', 'created');
  },
};
