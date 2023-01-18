<template lang="html">
  <v-dialog
    id="askForStore"
    v-model="logoutDialog.status"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        VCHC DATABASE LOGOUT
      </v-card-title>
      <v-card-text>
        Do you really want to logout?
      </v-card-text>
      <v-card-actions>
        <v-btn
          large
          color="primary"
          @click="logout"
        >
          LOGOUT
        </v-btn>
        <v-btn
          large
          color="secondary"
          @click="discard"
        >
          CANCEL
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex';
import HELPERS from '../../helpers';

export default {
  mixins: [HELPERS],
  data() {
    return {
    };
  },
  computed: {
    ...mapState('dialogs', [
      'logoutDialog',
    ]),
    ...mapGetters('api', [
      'f',
    ]),
  },
  methods: {
    ...mapMutations('api', [
      'logoutMut',
    ]),
    ...mapMutations('dialogs', [
      'closeDialog',
    ]),
    discard() {
      this.closeDialog('logoutDialog');
    },
    logout() {
      this.logoutMut();
      this.closeDialog('logoutDialog');
    },
  },
};
</script>

<style lang="css">
</style>
