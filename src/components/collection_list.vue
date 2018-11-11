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
          <td>{{ props.item.adlib }}</td>
          <td>{{ props.item._id }}</td>
          <td><v-btn :to="{ name: 'c', params: { id:  props.item._id  }}" color="info">Details</v-btn></td>
      </template>
    </v-data-table>
    <v-dialog v-model="collectiondialog" persistent max-width="600px" @keydown.esc="collectiondialog=false">
      <fundamentcard caption="Edit Collection">
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
    </v-dialog>
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
        { text: 'Range', value: 'type' },
        { text: 'Type', value: 'range' },
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
      this.setSize(this.pagination.rowsPerPage);
      this.setPage(this.pagination.page);
      this.get({ type: 'Collect' }).then((res) => {
        this.loading = false;
        this.data = res.data;
        this.totalHits = res.data.length;
      }).catch((err) => {
        if (err.response.data && err.response.data.detail === 'Invalid page.') {
          this.pagination.page -= 1;
          this.getRecords();
        }
      });
    }
  },
  created() {
    this.getRecords();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
