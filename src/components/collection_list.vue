<template>
  <div class="">
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
            <v-btn fab dark small :to="{ name: 'collectionsingle', params: { id:  props.item._id  }}" color="primary">
              <v-icon dark>collections_bookmark</v-icon>
            </v-btn>
            <v-btn fab dark small color="warning" @click="editCollection(props.item)">
              <v-icon dark>edit</v-icon>
            </v-btn>
            <v-btn fab dark small color="error" @click="deleteCollection(props.item._id)">
              <v-icon dark>delete</v-icon>
            </v-btn>
          </td>
      </template>
    </v-data-table>
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
          <fundamentcard caption="Collection Data">
            <div slot="content">
              <v-card color="grey lighten-2" class="pa-4">
                <collectionform :value="cedit" @input="cedits=$event"></collectionform>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="saveCollection()">Save</v-btn>
                  <v-btn color="primary" flat @click.native="collectiondialog=false">Discard</v-btn>
                </v-layout>
              </v-card>
            </div>
          </fundamentcard>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

import fundamentcard from './Fundament/FundamentCard';
import collectionform from './collection_form';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  components: {
    fundamentcard,
    collectionform,
  },
  data() {
    return {
      data: [],
      cedit: {},
      cedits: {},
      collectiondialog: false,
      loading: false,
      itemOptions: [50, 100, 200],
      totalHits: 0,
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
      console.log(this.pagination);
      this.get({
        type: 'Collect',
        sort: this.pagination.descending ? `-${this.pagination.sortBy}` : this.pagination.sortBy,
        limit: this.pagination.rowsPerPage,
        skip: (this.pagination.page - 1) * this.pagination.rowsPerPage,
      }).then((res) => {
        this.loading = false;
        this.data = res.data;
        this.totalHits = res.data.length;
      }).catch((err) => {
        if (err.response.data && err.response.data.detail === 'Invalid page.') {
          this.pagination.page -= 1;
          this.getRecords();
        }
      });
    },
    editCollection(obj) {
      this.collectiondialog = true;
      this.cedit = obj;
    },
    saveCollection() {
      if (this.cedits.url) {
        this.put({ type: 'collections', url: this.cedits.url, data: this.cedits }).then((res) => {
          this.getRecords();
        });
      }
      this.collectiondialog = false;
    },
    deleteCollection(url) {
      this.delete({ type: 'collections', url }).then((res) => {
        this.getRecords();
      });
    },
  },
  created() {
    this.getRecords();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
