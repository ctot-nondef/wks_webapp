<template>
  <v-app>
    <fundamentnav></fundamentnav>
    <v-content>
      <router-view name="Content"></router-view>
      <fundamentfooter></fundamentfooter>
    </v-content>
    <dialogs></dialogs>
  </v-app>
</template>

<script>
import axios from 'axios';
import { mapActions, mapMutations } from 'vuex';
import fundamentnav from './Fundament/FundamentNav';
import fundamentfooter from './Fundament/FundamentFooter';
import dialogs from './Dialogs/Dialogs';
/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint no-return-assign: "off" */

import HELPERS from '../helpers';

export default {
  mixins: [HELPERS],
  data() {
    return {
    };
  },
  name: 'App',
  components: {
    fundamentnav,
    fundamentfooter,
    dialogs,
  },
  methods: {
    ...mapActions('api', {
      dbInit: 'init',
    }),
    ...mapActions('app', {
      appInit: 'init',
    }),
    ...mapMutations('app', [
      'setConfig',
    ]),
  },
  beforeCreate() {
    const pstate = HELPERS.methods.getLatestSession();
    HELPERS.methods.deleteOldSessions();
    console.log("beforecreate", pstate);
    axios.get('/static/nav.json')
      .then((res) => {
        this.$store.commit('app/setConfig', res.data);
        this.$store.dispatch('app/init', pstate);
        this.$store.dispatch('api/init', {pstate, config: res.data});
      })
      .catch(error => this.$log(error));
  },
  created() {
  },
};
</script>
