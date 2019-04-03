/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint no-param-reassign: ["error", { "props": false }] */

const state = {
  drawer: true,
  drawerclipped: true,
  fixed: false,
  config: {},
  miniVariant: true,
  rightDrawer: false,
  loggedin: false,
  p: ['loggedin', 'miniVariant'],
};

const getters = {

};

const mutations = {
  setState(s, pstate) {
    for (const key in pstate) {
      if (pstate.hasOwnProperty(key) && s.hasOwnProperty(key)) s[key] = pstate[key];
    }
  },
  setConfig(s, config) {
    s.config = config;
  },
  loginMut(s) {
    s.loggedin = true;
  },
  logoutMut(s) {
    s.loggedin = false;
  },
  toggleNavDrawerMini(s) {
    s.miniVariant = !s.miniVariant;
  },
  setNavDrawerMini(s) {
    if (!s.drawerclipped) s.miniVariant = true;
  },
  toggleNavDrawerClipped(s) {
    s.drawerclipped = !s.drawerclipped;
  },
  setNavDrawerMaxi(s) {
    s.miniVariant = false;
  },
  toggleRightDrawer(s) {
    s.rightDrawer = !s.rightDrawer;
  },
  toggleDrawer(s) {
    s.drawer = !s.drawer;
  },
};

const actions = {
  init({ commit }, pstate) {
    if (pstate!= null && pstate.pState.app) commit('setState', pstate.pState.app);
  },
  toggleAppMode({ commit }) {
    commit('toggleDrawer');
    commit('toggleRightDrawer');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
