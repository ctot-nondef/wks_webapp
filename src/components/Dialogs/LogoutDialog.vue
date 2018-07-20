<template lang="html">
    <v-dialog v-model="logoutDialog.status" id="askForStore" max-width="500px">
      <v-card>
        <v-card-title>
          VCHC DATABASE LOGIN
        </v-card-title>
        <v-card-text>
          Do you really want to logout?
        </v-card-text>
        <v-card-actions>
        <v-btn @click="logout" large color="primary">
          LOGOUT
        </v-btn>
        <v-btn @click="discard" large color="secondary">
          CANCEL
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import HELPERS from '../../helpers';
import { getLogout } from '../../assets/api.js';

export default {
  data() {
    return {
      show1: false,
      dialogShow: false,
      username: '',
      password: '',
    };
  },
  mixins: [HELPERS],
  methods: {
    ...mapMutations('app', [
      'logoutMut',
    ]),
    ...mapMutations('dialogs', [
      'closeDialog',
    ]),
    discard() {
      this.closeDialog('logoutDialog');
    },
    logout() {
      getLogout().then((res) => {
        this.logoutMut();
        this.closeDialog('logoutDialog');
      })
    },
  },
  computed: {
    ...mapState('dialogs',[
      'logoutDialog',
    ])
  },
  created() {
    this.dialogShow = true;
  },
};
</script>

<style lang="css">
</style>
