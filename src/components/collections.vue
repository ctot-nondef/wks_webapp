<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <fundamentcard caption="Collections">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="collectiondialog=true">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <list ref="collectionlist" EntityType="collect" :headers="listheaders" ></list>
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
              <v-btn color="warning" @click="addCollection()">Save</v-btn>
            </v-toolbar>
            <v-container grid-list-md text-xs-center>
              <v-card color="grey lighten-2" class="pa-4">
                <collectionform v-if="$store.state.api.schemas.collect" :value="newcollection" @input="newcollection=$event"></collectionform>
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
  /* eslint-disable no-param-reassign,no-underscore-dangle */

  import { mapActions } from 'vuex';

import fundamentcard from './Fundament/FundamentCard';
import list from './genericList/list';
import collectionform from './Forms/collect_form';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    components: {
      fundamentcard,
      collectionform,
      list,
    },
    data() {
      return {
        collectiondialog: false,
        newcollection: {},
        listheaders: [
          { text: 'Name', value: 'name', path: 'name' },
          { text: 'Actions' },
        ],
      };
    },
    methods: {
      ...mapActions('api', [
        'get',
        'post',
        'delete',
      ]),
      addCollection() {
        if (this.newcollection.place) {
          this.newcollection.place.forEach((el, idx, c) => {
            c[idx] = el._id;
          });
        }
        if (this.newcollection.time) {
          this.newcollection.time.forEach((el, idx, c) => {
            c[idx] = el._id;
          });
        }
        if (this.newcollection.creator) {
          this.newcollection.creator.forEach((el, idx, c) => {
            const rel = {};
            Object.keys(el).forEach((key) => {
              if (el[key]) {
                rel[key] = el[key]._id || el[key];
              }
            });
            c[idx] = rel;
          });
        }
        if (this.newcollection.classification) {
          this.newcollection.classification.forEach((el, idx, c) => {
            const rel = {};
            Object.keys(el).forEach((key) => {
              if (el[key]) {
                rel[key] = el[key]._id || el[key];
              }
            });
            c[idx] = rel;
          });
        }
        this.post({ type: 'collect', body: this.newcollection }).then((res) => {
          this.newcollection = {};
          this.collectiondialog = false;
          this.$refs.collectionlist.getRecords();
        });
      },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
