<template lang="html">
  <v-dialog
    id="askForStore"
    v-model="resetDialog.status"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        PASSWORD RESET REQUEST
      </v-card-title>
      <v-card-text>
        You will be sent a link allowing you to reset your password.
        <v-text-field
          v-model="email"
          type="text"
          label="Email"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn
          large
          color="primary"
          @click="login"
        >
          REQUEST
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
      email: '',
    };
  },
  computed: {
    ...mapState('dialogs', [
      'resetDialog',
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
    ...mapMutations('dialogs', [
      'closeDialog',
    ]),
    discard() {
      this.closeDialog('resetDialog');
    },
    login() {
      this.getClient.User.UserController_forgotPassword(
      null,
      { // Options object
        requestBody: {
          email: this.email,
        }
      }
      ).then(() => {
        this.closeDialog('resetDialog');
      })
      .catch(() => {
        this.closeDialog('resetDialog');
      });
    },
  },
};
</script>

<style lang="css">
</style>
