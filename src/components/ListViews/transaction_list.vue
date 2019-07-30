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
            <v-btn fab dark small color="warning" @click="editTransaction(props.item._id)">
              <v-icon dark>edit</v-icon>
            </v-btn>
            <v-btn fab dark small color="error" @click="deleteTransaction(props.item._id)">
              <v-icon dark>delete</v-icon>
            </v-btn>
          </td>
      </template>
    </v-data-table>
    <v-layout column justify-space-between>
      <v-dialog
        v-model="transactiondialog"
        @keydown.esc="transactiondialog=false"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click.native="transactiondialog=false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Edit Entry</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
            </v-toolbar-items>
            <v-btn color="warning" @click="saveTransaction()">Save</v-btn>
          </v-toolbar>
          <v-container grid-list-md text-xs-center>
            <v-card color="grey lighten-2" class="pa-4">
              <transactionform v-if="$store.state.api.schemas.transaction" :value="cedit" @input="cedits=$event"></transactionform>
              <v-layout justify-end row fill-height>
                <v-btn color="warning" @click="saveTransaction()">Save</v-btn>
                <v-btn color="primary" flat @click.native="transactiondialog=false">Discard</v-btn>
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
import transactionform from '../Forms/transaction_form';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    components: {
      fundamentcard,
      transactionform,
    },
    props: [
    ],
    data() {
      return {
        data: [],
        cedit: {},
        cedits: {},
        transactiondialog: false,
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
        this.get({
          type: 'Transaction',
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
      editTransaction(_id) {
        this.get({
          type: 'Transaction',
          query: JSON.stringify({
            _id,
          }),
          populate: JSON.stringify([
            { path: 'price.currency', select: 'name' },
            { path: 'actor.id', select: 'name' },
            { path: 'actor.role', select: 'name' },
          ]),
        }).then((res) => {
          this.cedit = res.data[0];
          this.transactiondialog = true;
        });
      },
      /* TODO: move reduction of populated ref fields to store */
      saveTransaction() {
        if (this.cedit._id) {
          if (this.cedit.actor) {
            this.cedit.actor.forEach((el, idx, c) => {
              const rel = {};
              Object.keys(el).forEach((key) => {
                if (el[key]) {
                  rel[key] = el[key]._id || el[key];
                }
              });
              c[idx] = rel;
            });
          }
          if (this.cedit.price) {
            this.cedit.price.forEach((el, idx, c) => {
              const rel = {};
              Object.keys(el).forEach((key) => {
                if (el[key]) {
                  rel[key] = el[key]._id || el[key];
                }
              });
              c[idx] = rel;
            });
          }
          this.post({ type: 'Transaction', id: this.cedit._id, body: this.cedit }).then(() => {
            this.getRecords();
          });
        }
        this.transactiondialog = false;
      },
      deleteTransaction(_id) {
        this.delete({ type: 'Transaction', id: _id }).then((res) => {
          this.getRecords();
        })
        .catch((err) => {
          this.getRecords();
        });
      },
      returnRef(item) {
        this.$emit('selectref', item);
      },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
