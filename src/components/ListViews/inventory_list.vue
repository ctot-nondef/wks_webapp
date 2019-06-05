<template>
  <div class="">
    <v-card color="grey lighten-2" class="pa-4 mb-3">
      <v-layout justify-start row fill-height>
      <v-flex xs6>
        <v-text-field
           v-model="filters.name"
           label="Filter By Name"
           @input="getRecords()"
           append-icon="close"
           :append-icon-cb="clearNameFilter"
         ></v-text-field>
       </v-flex>
     </v-layout>
    </v-card>
    <v-data-table
      :headers="headers"
      :items="data"
      :loading="loading"
      :total-items="totalHits"
      :pagination.sync="pagination"
      :rows-per-page-items="itemOptions"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props" >
          <td>{{ props.item.name }}</td>
          <td>
            <v-btn fab dark small :to="{ name: 'inventorysingle', params: { id:  props.item._id  }}" color="primary">
              <v-icon dark>collections_bookmark</v-icon>
            </v-btn>
            <v-btn fab dark small color="warning" @click="editInventory(props.item._id)">
              <v-icon dark>edit</v-icon>
            </v-btn>
            <v-btn fab dark small color="error" @click="deleteInventory(props.item._id)">
              <v-icon dark>delete</v-icon>
            </v-btn>
          </td>
      </template>
    </v-data-table>
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
            <v-toolbar-title>Edit Entry</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
            </v-toolbar-items>
            <v-btn color="warning" @click="saveInventory()">Save</v-btn>
          </v-toolbar>
          <v-container grid-list-md text-xs-center>
            <v-card color="grey lighten-2" class="pa-4">
              <inventoryform v-if="$store.state.api.schemas.inventory" :value="cedit" @input="cedits=$event"></inventoryform>
              <v-layout justify-end row fill-height>
                <v-btn color="warning" @click="saveInventory()">Save</v-btn>
                <v-btn color="primary" flat @click.native="inventorydialog=false">Discard</v-btn>
              </v-layout>
            </v-card>
          </v-container>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  /* eslint-disable no-underscore-dangle,no-param-reassign */

  import { mapMutations, mapActions } from 'vuex';

import fundamentcard from '../Fundament/FundamentCard';
import inventoryform from '../Forms/inventory_form';
import simpleautocompwrapper from '../FormComponents/SimpleAutoCompleteWrapper';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    components: {
      fundamentcard,
      inventoryform,
      simpleautocompwrapper,
    },
    props: [
      'filter',
    ],
    data() {
      return {
        data: [],
        cedit: {},
        cedits: {},
        inventorydialog: false,
        loading: false,
        itemOptions: [10, 10, 50],
        totalHits: 0,
        filters: {
          name: '',
          partOf: '',
        },
        headers: [
          { text: 'Name', value: 'name' },
          { text: 'Actions', value: 'actions' },
        ],
        pagination: {},
      };
    },
    watch: {
      pagination: {
        handler() {
          this.getRecords();
        },
        deep: true,
      },
      filter(f) {
        if (f) {
          Object.keys(f).forEach((key) => {
            this.filters[key] = f[key];
          });
        }
        this.getRecords();
      },
    },
    methods: {
      ...mapActions('api', [
        'get',
        'post',
        'delete',
      ]),
      ...mapMutations('api', [
        'setPage',
        'setSize',
      ]),
      getRecords() {
        this.loading = true;
        const q = {};
        if (this.filters.name !== '') q.name = { $regex: this.filters.name };
        if (this.filters.partOf !== '') q.partOf = this.filters.partOf;
        this.get({
          type: 'Inventory',
          sort: this.pagination.descending ? `-${this.pagination.sortBy}` : this.pagination.sortBy,
          limit: this.pagination.rowsPerPage,
          skip: (this.pagination.page - 1) * this.pagination.rowsPerPage,
          query: JSON.stringify(q),
        }).then((res) => {
          this.loading = false;
          this.data = res.data;
          this.totalHits = parseInt(res.headers['x-total-count'], 10);
        }).catch((err) => {
          if (err.response.data && err.response.data.detail === 'Invalid page.') {
            this.pagination.page -= 1;
            this.getRecords();
          }
        });
      },
      editInventory(_id) {
        this.get({
          type: 'Inventory',
          query: JSON.stringify({
            _id,
          }),
          populate: JSON.stringify([
            { path: 'inventory' },
            { path: 'place', select: 'name' },
            { path: 'partOf', select: 'name' },
            { path: 'creator.role', select: 'name' },
            { path: 'creator.id', select: 'name' },
            { path: 'classification.aspect', select: 'name' },
            { path: 'classification.descriptor', select: 'name' },
          ]),
        }).then((res) => {
          this.cedit = res.data[0];
          this.inventorydialog = true;
        });
      },
      saveInventory() {
        if (this.cedit._id) {
          if (this.cedit.creator) {
            this.cedit.creator.forEach((el, idx, c) => {
              const rel = {};
              Object.keys(el).forEach((key) => {
                if (el[key]) {
                  rel[key] = el[key]._id || el[key];
                }
              });
              c[idx] = rel;
            });
          }
          if (this.cedit.classification) {
            this.cedit.classification.forEach((el, idx, c) => {
              const rel = {};
              Object.keys(el).forEach((key) => {
                if (el[key]) {
                  rel[key] = el[key]._id || el[key];
                }
              });
              c[idx] = rel;
            });
          }
          if (this.cedit.place) {
            this.cedit.place = this.cedit.place._id;
          }
          if (this.cedit.partOf) {
            this.cedit.partOf = this.cedit.partOf._id;
          }
          this.post({ type: 'inventory', id: this.cedit._id, body: this.cedit }).then(() => {
            this.getRecords();
          });
        }
        this.inventorydialog = false;
      },
      deleteInventory(_id) {
        this.delete({ type: 'Inventory', id: _id }).then((res) => {
          this.getRecords();
        })
        .catch((err) => {
          this.getRecords();
        });
      },
      clearNameFilter() {
        this.namefilter = '';
        this.getRecords();
      },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
