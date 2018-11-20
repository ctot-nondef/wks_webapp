<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <fundamentcard caption="Collections">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="collectiondialog=true">
                  <v-icon dark>edit</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <collectionlist ref="collectionlist"></collectionlist>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <v-layout column justify-space-between>
        <v-dialog
          v-model="collectiondialog"
          @keydown.esc="collectiondialog=false"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          scrollable
          >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click.native="collectiondialog=false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Create Collection</v-toolbar-title>
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
                <collectionform :value="newcollection" @input="newcollection=$event"></collectionform>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="addCollection()">Save</v-btn>
                  <v-btn color="primary" flat @click.native="collectiondialog=false">Discard</v-btn>
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
import collectionlist from './collection_list';
import collectionform from './collection_form';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  components: {
    fundamentcard,
    collectionlist,
    collectionform,
  },
  data() {
    return {
      collectiondialog: false,
      newcollection: {},
    };
  },
  methods: {
    ...mapActions('api', [
      'get',
      'post',
      'delete',
    ]),
    addCollection() {
      if(this.newcollection.place) this.newcollection.place.forEach((el, idx, c) => {
        c[idx] = el._id;
      });
      if(this.newcollection.collector) this.newcollection.collector.forEach((el, idx, c) => {
        c[idx] = el._id;
      });
      this.post({ type: 'collect', body: this.newcollection }).then((res) => {
        this.newcollection = {};
        this.collectiondialog = false;
        this.$refs.collectionlist.getRecords();
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
