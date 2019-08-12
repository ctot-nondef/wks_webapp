<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <fundamentcard caption="Inventories">
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
              <inventorylist ref="inventorylist"></inventorylist>
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
              <v-toolbar-title>Create Inventory</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
              </v-toolbar-items>
              <v-btn color="warning" @click="addInventory()">Save</v-btn>
            </v-toolbar>
            <v-container grid-list-md text-xs-center>
              <v-card color="grey lighten-2" class="pa-4">
                <inventoryform v-if="$store.state.api.schemas.inventory" :value="newinventory" @input="newinventory=$event"></inventoryform>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="addInventory()">Save</v-btn>
                  <v-btn color="primary" dark flat @click.native="inventorydialog=false">Discard</v-btn>
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
  /* eslint-disable no-underscore-dangle,no-param-reassign */

  import { mapActions } from 'vuex';

import fundamentcard from './Fundament/FundamentCard';
import inventorylist from './ListViews/inventory_list';
import inventoryform from './Forms/inventory_form';
import editdialog from './editDialog';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    components: {
      fundamentcard,
      inventorylist,
      inventoryform,
      editdialog,
    },
    data() {
      return {
        inventorydialog: false,
        newinventory: {},
      };
    },
    methods: {
      ...mapActions('api', [
        'get',
        'post',
        'delete',
      ]),
      addInventory() {
        if (this.newinventory.creator) {
          this.newinventory.creator.forEach((el, idx, c) => {
            const rel = {};
            Object.keys(el).forEach((key) => {
              if (el[key]) {
                rel[key] = el[key]._id || el[key];
              }
            });
            c[idx] = rel;
          });
        }
        if (this.newinventory.classification) {
          this.newinventory.classification.forEach((el, idx, c) => {
            const rel = {};
            Object.keys(el).forEach((key) => {
              if (el[key]) {
                rel[key] = el[key]._id || el[key];
              }
            });
            c[idx] = rel;
          });
        }
        if (this.newinventory.place) {
          this.newinventory.place = this.newinventory.place._id;
        }
        if (this.newinventory.partOf) {
          this.newinventory.partOf = this.newinventory.partOf._id;
        }
        this.post({ type: 'inventory', body: this.newinventory }).then((res) => {
          this.newinventory = {};
          this.inventorydialog = false;
          this.$refs.inventorylist.getRecords();
        });
      },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
