<template>
  <div>
    <fundamentnav />
    <v-main v-if="$store.state.api.init">
      <router-view name="Content" />
      <fundamentfooter />
    </v-main>
    <dialogs />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import fundamentnav from './Fundament/FundamentNav';
import fundamentfooter from './Fundament/FundamentFooter';
import dialogs from './Dialogs/Dialogs';
/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint no-return-assign: "off" */

import HELPERS from '../helpers';
import config from '../config/config';

export default {
  name: 'App',
  components: {
    fundamentnav,
    fundamentfooter,
    dialogs,
  },
  mixins: [HELPERS],
  data() {
    return {
    };
  },
  beforeCreate() {
    const pstate = HELPERS.methods.getLatestSession();
    HELPERS.methods.deleteOldSessions();
    this.$store.commit('app/setConfig', config);
    this.$store.dispatch('app/init', pstate);
    this.$store.dispatch('api/init', { pstate, config, vm: this });
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
};
</script>
