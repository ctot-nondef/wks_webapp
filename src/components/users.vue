<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <fundamentcard caption="users">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="userdialog=true">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <userlist ref="userlist"></userlist>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <v-layout column justify-space-between>
        <v-dialog
          v-model="userdialog"
          @keydown.esc="userdialog=false"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          scrollable
          >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click.native="userdialog=false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Create user</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
              </v-toolbar-items>
              <v-menu bottom right offset-y>
                <v-btn slot="activator" dark icon>
                  <v-icon>more_vert</v-icon>
                </v-btn>
              </v-menu>
            </v-toolbar>
            <v-container grid-list-md text-xs-center>
              <v-card color="grey lighten-2" class="pa-4">
                <userform :value="newuser" @input="newuser=$event"></userform>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="adduser()">Save</v-btn>
                  <v-btn color="primary" flat @click.native="userdialog=false">Discard</v-btn>
                </v-layout>
              </v-card>
            </v-container>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
    <v-container grid-list-md v-if="!$store.state.app.loggedin">
      Bitte loggen Sie sich ein um die Datenbank zu benutzen.
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import HELPERS from '../helpers';

import fundamentcard from './Fundament/FundamentCard';
import userlist from './ListViews/user_list';
import userform from './Forms/user_form';
import autocompgnd from './AutoCompleteComponents/AutocompGND';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  mixins: [HELPERS],
  components: {
    fundamentcard,
    userlist,
    userform,
    autocompgnd,
  },
  data() {
    return {
      userdialog: false,
      newuser: {},
      iuser: {},
      itype: 'Person',
    };
  },
  methods: {
    ...mapActions('api', [
      'get',
      'post',
      'delete',
    ]),
    adduser() {
      this.newuser.username = `${this.newuser.firstName[0].toLowerCase()}${this.newuser.lastName.toLowerCase()}`;
      this.post({ type: 'user', body: this.newuser }).then((res) => {
        this.newuser = {};
        this.userdialog = false;
        this.$refs.userlist.getRecords();
      });
    },
  },
  computed: {
  },
  created() {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
