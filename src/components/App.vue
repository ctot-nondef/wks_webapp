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

export default {
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
    ...mapActions('jowl', [
      'setOntology',
      'constructJOWL',
    ]),
    ...mapMutations('JSONschema', [
      'constructJSONschema',
    ]),
    ...mapActions('n3', [
      'constructN3',
    ]),
    ...mapActions('app', [
      'toggleAppMode',
    ]),
    ...mapMutations('app', [
      'setConfig',
      'toggleNavDrawerMini',
      'setNavDrawerMini',
      'setNavDrawerMaxi',
      'toggleNavDrawerClipped',
      'toggleRightDrawer',
      'toggleDrawer',
      'toggleNavbar',
    ]),
  },
  created() {
    axios.get('/static/nav.json')
      .then(res => this.setConfig(res.data))
      .catch(error => this.$log(error));
    this.setOntology('static/acdh-schema.owl');
  },
};
</script>
