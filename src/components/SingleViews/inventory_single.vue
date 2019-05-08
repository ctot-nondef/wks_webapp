<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <fundamentcard :caption="view.name">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="inventorydialog=true">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <entrylist ref="inventorylist" :filter="{ partOf: this.$route.params.id }"></entrylist>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <v-layout column justify-space-between>
        <v-dialog
          v-model="inventorydialog"
          @keydown.esc="inventorydialog=false"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click.native="inventorydialog=false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Create Entry</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
              </v-toolbar-items>
              <v-btn color="warning" @click="addInventory()">Save</v-btn>
            </v-toolbar>
            <v-container grid-list-md text-xs-center>
              <v-card color="grey lighten-2" class="pa-4">
                <entryform v-if="$store.state.api.schemas.entry" :value="newentry" @input="newentry=$event"></entryform>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="addInventory()">Save</v-btn>
                  <v-btn color="primary" flat @click.native="inventorydialog=false">Discard</v-btn>
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

import fundamentcard from '../Fundament/FundamentCard';
import entrylist from '../ListViews/entry_list';
import entryform from '../Forms/entry_form';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  components: {
    fundamentcard,
    entrylist,
    entryform,
  },
  data() {
    return {
      view: {},
      data: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Range', value: 'type' },
        { text: 'Type', value: 'range' },
      ],
      inventorydialog: false,
      newentry: {},
    };
  },
  methods: {
    ...mapActions('api', [
      'get',
      'post',
      'delete',
    ]),
    addInventory() {
      if (this.newinventory.creator) this.newinventory.creator.forEach((el, idx, c) => {
        var rel = {};
        Object.keys(el).forEach((key) => {
          rel[key] = el[key]._id || el[key];
        });
        c[idx] = rel;
      });
      if (this.newinventory.classification) this.newinventory.classification.forEach((el, idx, c) => {
        var rel = {};
        Object.keys(el).forEach((key) => {
          rel[key] = el[key]._id || el[key];
        });
        c[idx] = rel;
      });
      if (this.newinventory.place) {
        this.newinventory.place = this.newinventory.place._id;
      }
      if (this.newinventory.partOf) {
        this.newinventory.partOf = this.newinventory.partOf._id;
      }
      this.post({ type: 'inventory', body: this.newinventory }).then((res) => {
        this.newentry = {
          partOf: this.view,
        }
        this.inventorydialog = false;
        this.$refs.inventorylist.getRecords();
      });
    },
  },
  computed: {
  },
  created() {
    this.get({ type: 'Inventory', id: this.$route.params.id }).then((res) => {
      this.view = res.data;
      this.newentry = {
        partOf: res.data,
      }
    });

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
