<template lang="html">
    <v-dialog v-model="loginDialog.status" id="askForStore" max-width="500px">
      <v-card>
        <v-card-title>
          VCHC DATABASE LOGIN
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="username" type="text" label="Username"></v-text-field>
          <v-text-field v-model="password" type="password" label="Password"></v-text-field>
        </v-card-text>
        <v-card-actions>
        <v-btn @click="login" large color="primary">
          LOGIN
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
import { postLogin } from '../../assets/api.js';

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
      'loginMut',
    ]),
    ...mapMutations('dialogs', [
      'closeDialog',
    ]),
    discard() {
      this.closeDialog('loginDialog');
    },
    login() {
      postLogin({
        user: {
          username: this.username,
          password: this.password
        }
      }).then((res) => {
        this.loginMut();
        this.closeDialog('loginDialog');
      })
    },
  },
  computed: {
    ...mapState('dialogs',[
      'loginDialog',
    ])
  },
  created() {
    this.dialogShow = true;
  },
};
</script>

<style lang="css">
</style>
