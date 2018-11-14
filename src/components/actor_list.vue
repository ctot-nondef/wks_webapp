<template>
  <div class="">
    <v-card color="grey lighten-2" class="pa-4 mb-3">
      <v-layout justify-end row fill-height>
      <v-flex xs6>
        <v-select
          v-model="classfilter"
          :items="$store.state.api.classes.Actor"
          item-text="labels[4].label"
          item-value="_id"
          label="Filter by Type"
          @input="getRecords()"
          append-icon="close"
          :append-icon-cb="clearClassFilter"
        ></v-select>
      </v-flex>
      <v-flex xs6>
        <v-text-field
           v-model="namefilter"
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
            <div v-if="props.item.instanceOf">
              {{ props.item.instanceOf.labels[4].label }}
            </div>
          </td>
          <td>
            <v-btn fab dark small :to="{ name: 'actorsingle', params: { id:  props.item._id  }}" color="primary">
              <v-icon dark>collections_bookmark</v-icon>
            </v-btn>
            <v-btn fab dark small color="warning" @click="editactor(props.item._id)">
              <v-icon dark>edit</v-icon>
            </v-btn>
            <v-btn fab dark small color="error" @click="deleteactor(props.item._id)">
              <v-icon dark>delete</v-icon>
            </v-btn>
          </td>
      </template>
    </v-data-table>
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
            <v-toolbar-title>Edit Actor</v-toolbar-title>
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
              <actorform :value="cedit" @input="cedits=$event"></actorform>
              <v-layout justify-end row fill-height>
                <v-btn color="warning" @click="saveactor()">Save</v-btn>
                <v-btn color="primary" flat @click.native="actordialog=false">Discard</v-btn>
              </v-layout>
            </v-card>
          </v-container>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

import fundamentcard from './Fundament/FundamentCard';
import actorform from './actor_form';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  components: {
    fundamentcard,
    actorform,
  },
  data() {
    return {
      data: [],
      cedit: {},
      cedits: {},
      actordialog: false,
      loading: false,
      itemOptions: [10, 20, 50],
      totalHits: 0,
      classfilter: '',
      namefilter: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'instanceOf' },
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
      let q = {}
      if (this.classfilter != '') q.instanceOf = this.classfilter;
      if (this.namefilter != '') q.name = {"$regex": this.namefilter };
      this.get({
        type: 'Actor',
        sort: this.pagination.descending ? `-${this.pagination.sortBy}` : this.pagination.sortBy,
        limit: this.pagination.rowsPerPage,
        skip: (this.pagination.page - 1) * this.pagination.rowsPerPage,
        populate: JSON.stringify([
          {"path":"instanceOf"}
        ]),
        query: JSON.stringify(q),
      }).then((res) => {
        this.loading = false;
        this.data = res.data;
        this.totalHits = parseInt(res.headers['x-total-count']);
      }).catch((err) => {
        console.log(err);
        if (err.response.data && err.response.data.detail === 'Invalid page.') {
          this.pagination.page -= 1;
          this.getRecords();
        }
      });
    },
    editactor(_id) {
      this.get({
        type: 'Actor',
        query: JSON.stringify({
          _id: _id,
        }),
        populate: JSON.stringify([
          {"path":"instanceOf"}
        ]),
      }).then((res) => {
        this.cedit = res.data[0];
        this.actordialog = true;
      });
    },
    saveactor() {
      console.log(this.cedits);
      if (this.cedits._id) {
        console.log(this.cedits);
        if(this.cedits.place) this.cedits.place.forEach((el, idx, c) => {
          c[idx] = el._id;
        });
        if(this.cedits.collector) this.cedits.collector.forEach((el, idx, c) => {
          c[idx] = el._id;
        });
        console.log(this.cedits);
        this.post({ type: 'Actor', id: this.cedits._id, body: this.cedits }).then((res) => {
          this.getRecords();
        });
      }
      this.actordialog = false;
    },
    deleteactor(_id) {
      this.delete({ type: 'Actor', id: _id }).then((res) => {
        this.getRecords();
      })
      .catch((err) => {
        this.getRecords();
      });
    },
    clearClassFilter() {
      this.classfilter = '';
      this.getRecords()
    },
    clearNameFilter() {
      this.namefilter = '';
      this.getRecords()
    },
  },
  created() {

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
