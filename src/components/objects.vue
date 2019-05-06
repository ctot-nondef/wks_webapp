<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <fundamentcard caption="Objects">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="objectdialog=true">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <objectlist ref="objectlist"></objectlist>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <v-layout column justify-space-between>
        <v-dialog
          v-model="objectdialog"
          @keydown.esc="objectdialog=false"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          scrollable
          >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click.native="objectdialog=false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Create Object</v-toolbar-title>
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
                <objectform v-if="$store.state.api.schemas.object" :value="newobject" @input="newobject=$event"></objectform>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="addobject()">Save</v-btn>
                  <v-btn color="primary" flat @click.native="objectdialog=false">Discard</v-btn>
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
import { mapActions, mapGetters } from 'vuex';

import HELPERS from '../helpers';

import fundamentcard from './Fundament/FundamentCard';
import objectlist from './ListViews/object_list';
import objectform from './Forms/object_form';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  mixins: [HELPERS],
  components: {
    fundamentcard,
    objectlist,
    objectform,
  },
  data() {
    return {
      objectdialog: false,
      newobject: {},
      iobject: {},
      itype: 'Object',
    };
  },
  methods: {
    ...mapActions('api', [
      'get',
      'post',
      'delete',
    ]),
    addobject() {
      if (this.newobject.currentOwner) this.newobject.currentOwner.forEach((el, idx, c) => {
        c[idx] = el._id;
      });
      if (this.newobject.material) this.newobject.material.forEach((el, idx, c) => {
        c[idx] = el._id;
      });
      if (this.newobject.technique) this.newobject.technique.forEach((el, idx, c) => {
        c[idx] = el._id;
      });
      if (this.newobject.creator) this.newobject.creator.forEach((el, idx, c) => {
        var rel = {};
        Object.keys(el).forEach((key) => {
          if (el[key]) {
            rel[key] = el[key]._id || el[key];
          }
        });
        c[idx] = rel;
      });
      if (this.newobject.dimensions) this.newobject.dimensions.forEach((el, idx, c) => {
        var rel = {};
        Object.keys(el).forEach((key) => {
          if (el[key]) {
            rel[key] = el[key]._id || el[key];
          }
        });
        c[idx] = rel;
      });
      if (this.newobject.classification) this.newobject.classification.forEach((el, idx, c) => {
        var rel = {};
        Object.keys(el).forEach((key) => {
          if (el[key]) {
            rel[key] = el[key]._id || el[key];
          }
        });
        c[idx] = rel;
      });
      if (this.newobject.collector) this.newobject.collector.forEach((el, idx, c) => {
        c[idx] = el._id;
      });
      this.post({ type: 'object', body: this.newobject }).then((res) => {
        this.newobject = {};
        this.objectdialog = false;
        this.$refs.objectlist.getRecords();
      });
    },
  },
  computed: {
    ...mapGetters('api', [
      'apiloaded',
    ]),
  },
  created() {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
