<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.api.loggedin">
      <fundamentcard caption="Entries">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="entrydialog=true">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <list ref="entrylist" EntityType="entry" :headers="listheaders" ></list>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <v-layout column justify-space-between>
        <v-dialog
          v-model="entrydialog"
          @keydown.esc="entrydialog=false"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click.native="entrydialog=false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Create Entry</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
              </v-toolbar-items>
              <v-btn color="warning" @click="addentry()">Save</v-btn>
            </v-toolbar>
            <v-container grid-list-md text-xs-center>
            <v-card color="grey lighten-2" class="pa-4">
                <entryform v-if="$store.state.api.schemas.entry" :value="newentry" @input="newentry=$event"></entryform>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="addentry()">Save</v-btn>
                  <v-btn color="primary" flat @click.native="entrydialog=false">Discard</v-btn>
                </v-layout>
              </v-card>
            </v-container>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
    <v-container grid-list-md v-if="!$store.state.api.loggedin">
      Bitte loggen Sie sich ein um die Datenbank zu benutzen.
    </v-container>
  </div>
</template>

<script>
  /* eslint-disable no-underscore-dangle,no-param-reassign */

  import { mapActions, mapGetters } from 'vuex';

import HELPERS from '../helpers';

import fundamentcard from './Fundament/FundamentCard';
import list from './genericList/list';
import entryform from './Forms/entry_form';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    mixins: [HELPERS],
    components: {
      fundamentcard,
      list,
      entryform,
    },
    data() {
      return {
        entrydialog: false,
        newentry: {},
        ientry: {},
        itype: 'Entry',
        listheaders: [
          { text: 'Name', value: 'name', path: 'name' },
          { text: 'Original Title', value: 'originalTitle', path: 'originalTitle' },
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
      addentry() {
        if (this.newentry.partOf) {
          this.newentry.partOf = this.newentry.partOf._id;
        }
        if (this.newentry.material) {
          this.newentry.material.forEach((el, idx, c) => {
            c[idx] = el._id;
          });
        }
        if (this.newentry.technique) {
          this.newentry.technique.forEach((el, idx, c) => {
            c[idx] = el._id;
          });
        }
        if (this.newentry.transaction) {
          this.newentry.transaction.forEach((el, idx, c) => {
            c[idx] = el._id;
          });
        }
        if (this.newentry.creator) {
          this.newentry.creator.forEach((el, idx, c) => {
            const rel = {};
            Object.keys(el).forEach((key) => {
              if (el[key]) {
                rel[key] = el[key]._id || el[key];
              }
            });
            c[idx] = rel;
          });
        }
        if (this.newentry.dimensions) {
          this.newentry.dimensions.forEach((el, idx, c) => {
            const rel = {};
            Object.keys(el).forEach((key) => {
              if (el[key]) {
                rel[key] = el[key]._id || el[key];
              }
            });
            c[idx] = rel;
          });
        }
        if (this.newentry.classification) {
          this.newentry.classification.forEach((el, idx, c) => {
            const rel = {};
            Object.keys(el).forEach((key) => {
              if (el[key]) {
                rel[key] = el[key]._id || el[key];
              }
            });
            c[idx] = rel;
          });
        }
        if (this.newentry.collector) {
          this.newentry.collector.forEach((el, idx, c) => {
            c[idx] = el._id;
          });
        }
        if (this.newentry.relations) {
          this.newentry.relations.forEach((el, idx, c) => {
            const rel = {};
            Object.keys(el).forEach((key) => {
              if (el[key]) {
                rel[key] = el[key]._id || el[key];
              }
            });
            c[idx] = rel;
          });
        }
        this.post({ type: 'entry', body: this.newentry }).then((res) => {
          this.newentry = {};
          this.entrydialog = false;
          this.$refs.entrylist.getRecords();
        });
      },
    },
    computed: {
      ...mapGetters('api', [
        'apiloaded',
      ]),
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
