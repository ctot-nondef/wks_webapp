<template>
  <div class="">
    <v-card color="grey lighten-2" class="pa-4 mb-3">
      <v-layout justify-start row fill-height>
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
            <!-- <v-btn fab dark small :to="{ name: 'objectsingle', params: { id:  props.item._id  }}" color="primary">
              <v-icon dark>collections_bookmark</v-icon>
            </v-btn> -->
            <v-btn fab dark small color="warning" @click="editobject(props.item._id)">
              <v-icon dark>edit</v-icon>
            </v-btn>
            <v-btn fab dark small color="error" @click="deleteobject(props.item._id)">
              <v-icon dark>delete</v-icon>
            </v-btn>
          </td>
      </template>
    </v-data-table>
    <v-layout column justify-space-between>
      <v-dialog

        v-model="objectdialog"
        @keydown.esc="objectdialog=false"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click.native="objectdialog=false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Edit Object</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
            </v-toolbar-items>
            <v-btn color="warning" @click="saveobject()">Save</v-btn>
          </v-toolbar>
          <v-container grid-list-md text-xs-center>
            <v-card color="grey lighten-2" class="pa-4">
              <objectform v-if="$store.state.api.schemas.object" :value="cedit" @input="cedits=$event"></objectform>
              <v-layout justify-end row fill-height>
                <v-btn color="warning" @click="saveobject()">Save</v-btn>
                <v-btn color="primary" flat @click.native="objectdialog=false">Discard</v-btn>
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
import objectform from '../Forms/object_form';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    components: {
      fundamentcard,
      objectform,
    },
    data() {
      return {
        data: [],
        cedit: {},
        cedits: {},
        objectdialog: false,
        loading: false,
        itemOptions: [10, 20, 50],
        totalHits: 0,
        classfilter: '',
        namefilter: '',
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
        const q = {};
        if (this.classfilter !== '') q.instanceOf = this.classfilter;
        if (this.namefilter !== '') q.name = { $regex: this.namefilter };
        this.get({
          type: 'Object',
          sort: this.pagination.descending ? `-${this.pagination.sortBy}` : this.pagination.sortBy,
          limit: this.pagination.rowsPerPage,
          skip: (this.pagination.page - 1) * this.pagination.rowsPerPage,
          populate: JSON.stringify([
            { path: 'instanceOf' },
          ]),
          query: JSON.stringify(q),
        }).then((res) => {
          this.loading = false;
          this.data = res.data;
          this.totalHits = parseInt(res.headers['x-total-count'], 10);
        }).catch((err) => {
          console.log(err);
          if (err.response.data && err.response.data.detail === 'Invalid page.') {
            this.pagination.page -= 1;
            this.getRecords();
          }
        });
      },
      editobject(_id) {
        this.get({
          type: 'Object',
          query: JSON.stringify({
            _id,
          }),
          populate: JSON.stringify([
            { path: 'instanceOf' },
            { path: 'images.reference' },
            { path: 'currentOwner', select: 'name' },
            { path: 'material', select: 'name' },
            { path: 'technique', select: 'name' },
            { path: 'creator.role', select: 'name' },
            { path: 'creator.id', select: 'name' },
            { path: 'dimensions.aspect', select: 'name' },
            { path: 'dimensions.unit', select: 'name' },
            { path: 'classification.aspect', select: 'name' },
            { path: 'classification.descriptor', select: 'name' },
          ]),
        }).then((res) => {
          this.cedit = res.data[0];
          this.objectdialog = true;
        });
      },
      /* TODO: move reduction of populated ref fields to store */
      saveobject() {
        // this needs to be redone
        // how can we systematically reduce all referenced/populated docs
        // to ids before submission?
        if (this.cedit._id) {
          if (this.cedit.currentOwner) {
            this.cedit.currentOwner.forEach((el, idx, c) => {
              c[idx] = el._id;
            });
          }
          if (this.cedit.material) {
            this.cedit.material.forEach((el, idx, c) => {
              c[idx] = el._id;
            });
          }
          if (this.cedit.technique) {
            this.cedit.technique.forEach((el, idx, c) => {
              c[idx] = el._id;
            });
          }
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
          if (this.cedit.dimensions) {
            this.cedit.dimensions.forEach((el, idx, c) => {
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
          if (this.cedit.collector) {
            this.cedit.collector.forEach((el, idx, c) => {
              c[idx] = el._id;
            });
          }
          this.post({ type: 'object', id: this.cedit._id, body: this.cedit }).then(() => {
            this.getRecords();
          });
        }
        this.objectdialog = false;
      },
      deleteobject(_id) {
        this.delete({ type: 'Object', id: _id }).then(() => {
          this.getRecords();
        })
        .catch((err) => {
          this.getRecords();
        });
      },
      clearClassFilter() {
        this.classfilter = '';
        this.getRecords();
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
