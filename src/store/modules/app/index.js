/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint no-param-reassign: ["error", { "props": false }] */

const state = {
  drawer: true,
  drawerclipped: true,
  fixed: false,
  config: {},
  miniVariant: true,
  rightDrawer: false,
  p: ['miniVariant'],
};

const getters = {

};

const mutations = {
  setState(s, pstate) {
    Object.keys(pstate).forEach((key) => {
      if (pstate[key] !== undefined && s[key] !== undefined) s[key] = pstate[key];
    });
  },
  setConfig(s, config) {
    s.config = config;
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
    if (pstate !== null && pstate.pState.app) commit('setState', pstate.pState.app);
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
