<template lang="html">
  <v-dialog
    id="askForStore"
    v-model="loginDialog.status"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        VCHC DATABASE LOGIN
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="username"
          type="text"
          label="Email"
        />
        <v-text-field
          v-model="password"
          type="password"
          label="Password"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn
          large
          color="primary"
          @click="login"
        >
          LOGIN
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
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex';
import HELPERS from '../../helpers';

export default {
  mixins: [HELPERS],
  data() {
    return {
      username: '',
      password: '',
    };
  },
  computed: {
    ...mapState('dialogs', [
      'loginDialog',
    ]),
    ...mapGetters('api', [
      'init',
      'getClient',
    ]),
  },
  methods: {
    ...mapActions('api', {
      dbInit: 'init',
    }),
    ...mapMutations('api', [
      'loginMut',
    ]),
    ...mapMutations('dialogs', [
      'closeDialog',
    ]),
    discard() {
      this.closeDialog('loginDialog');
    },
    login() {
      this.getClient.User.UserController_login(
      null,
      { // Options object
        requestBody: {
          email: this.username,
          password: this.password
        }
      }
      ).then((res) => {
        this.loginMut({ token: res.body.accessToken, refreshtoken: res.body.refreshToken, user: res.body.email });
        this.closeDialog('loginDialog');
      });
    },
  },
};
</script>

<style lang="css">
</style>
