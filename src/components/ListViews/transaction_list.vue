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
          <td>{{ props.item.date }}</td>
          <td>
            <span v-if="props.item.actor[0] && props.item.actor[0].id">{{ props.item.actor[0].id.name }}</span> -
            <span v-if="props.item.actor[0] && props.item.actor[0].role">{{ props.item.actor[0].role.name }}</span>
          </td>
          <td>
            <v-btn fab dark small :to="{ name: 'transactionsingle', params: { id:  props.item._id  }}" color="primary">
              <v-icon dark>collections_bookmark</v-icon>
            </v-btn>
            <v-btn fab dark small color="warning" @click="$refs.editdialog.getItem('transaction', props.item._id)">
              <v-icon dark>edit</v-icon>
            </v-btn>
            <v-btn fab dark small color="error" @click="deleteTransaction(props.item._id)">
              <v-icon dark>delete</v-icon>
            </v-btn>
          </td>
      </template>
    </v-data-table>
    <editdialog title="Edit Transaction Record" ref="editdialog" @close="getRecords()">
      <template slot="form" slot-scope="props">
        <transactionform :value="props.item" @input="props.item=$event"></transactionform>
      </template>
    </editdialog>
  </div>
</template>

<script>
  /* eslint-disable no-underscore-dangle,no-param-reassign */
import { mapMutations, mapActions } from 'vuex';

import fundamentcard from '../Fundament/FundamentCard';
import transactionform from '../Forms/transaction_form';
import editdialog from '../editDialog';
/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    components: {
      fundamentcard,
      transactionform,
      editdialog,
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
          { text: 'Date', value: 'date' },
          { text: 'Actor', value: 'actor' },
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
          populate: JSON.stringify([
            { path: 'actor.id', select: 'name' },
            { path: 'actor.role', select: 'name' },
          ]),
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
