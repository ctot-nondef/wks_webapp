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
  created() {
    axios.get('/static/nav.json')
      .then(res => this.setConfig(res.data))
      .catch(error => this.$log(error));
    const pstate = this.getLatestSession();
    this.deleteOldSessions();
    this.dbInit(pstate);
    this.appInit(pstate);
  },
};
</script>
