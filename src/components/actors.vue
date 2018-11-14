<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <fundamentcard caption="Actors">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="actordialog=true">
                  <v-icon dark>edit</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <actorlist ref="actorlist"></actorlist>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <v-layout column justify-space-between>
        <v-dialog
          v-model="actordialog"
          @keydown.esc="actordialog=false"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          scrollable
          >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click.native="actordialog=false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Create Actor</v-toolbar-title>
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
                  <actorform :value="newactor" @input="newactor=$event"></actorform>
                  <v-layout justify-end row fill-height>
                    <v-btn color="warning" @click="addactor()">Save</v-btn>
                    <v-btn color="primary" flat @click.native="actordialog=false">Discard</v-btn>
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

import fundamentcard from './Fundament/FundamentCard';
import actorlist from './actor_list';
import actorform from './actor_form';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  components: {
    fundamentcard,
    actorlist,
    actorform,
  },
  data() {
    return {
      actordialog: false,
      newactor: {},
    };
  },
  methods: {
    ...mapActions('api', [
      'get',
      'post',
      'delete',
    ]),
    addactor() {
      if(this.newactor.place) this.newactor.place.forEach((el, idx, c) => {
        c[idx] = el._id;
      });
      if(this.newactor.collector) this.newactor.collector.forEach((el, idx, c) => {
        c[idx] = el._id;
      });
      this.post({ type: 'actor', body: this.newactor }).then((res) => {
        this.newactor = {};
        this.actordialog = false;
        this.$refs.actorlist.getRecords();
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
