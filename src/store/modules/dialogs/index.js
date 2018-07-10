/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint-disable no-underscore-dangle */
const state = {
  clearcachedialog: { status: false },
  storedialog: { status: false },
  deletesubjectdialog: { status: false, uri: '' },
  addnewsubjectmodal: { status: false, item: {}, changedItem: {} },
  filesizedialog: { status: false, file: '', size: '', result: '' },
};

const getters = {

};

const mutations = {
  openDialog(s, name) {
    s[name].status = true;
  },
  closeDialog(s, name) {
    s[name].status = false;
  },
  switchDialog(s, name) {
    s[name].status = !s[name];
  },
  setDialog(s, { name, obj }) {
    this._vm.$info('store dialogs setDialog', name, obj);
    s[name] = obj;
  },
};


export default {
  namespaced: true,
  state,
  mutations,
  getters,
};
