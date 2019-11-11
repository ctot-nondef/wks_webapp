<template>
  <div class="">
    <v-data-table
      :headers="currentHeaders"
      :items="data"
      :loading="loading"
      :total-items="totalHits"
      :pagination.sync="pagination"
      :rows-per-page-items="itemOptions"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props" >
          <td v-for="column in currentHeaders" v-if="column.path">{{ _.get(props.item, column.path) }}</td>
          <td v-if="$store.state.api.loggedin">
            <v-btn v-if="entitytype !== 'transaction'" fab dark small :to="{ name: `${entitytype}single`, params: { id:  props.item._id  }}" color="primary">
              <v-icon dark>collections_bookmark</v-icon>
            </v-btn>
            <v-btn v-if="entitytype === 'transaction'" fab dark small color="primary" @click="$emit('select', props.item)">
              <v-icon dark>collections_bookmark</v-icon>
            </v-btn>
            <v-btn fab dark small color="warning" @click="$refs.editdialog.getItem(entitytype, props.item._id)">
              <v-icon dark>edit</v-icon>
            </v-btn>
            <v-btn fab dark small color="error" @click="deleteRequest(props.item)">
              <v-icon dark>delete</v-icon>
            </v-btn>
          </td>
          <td v-if="!$store.state.api.loggedin"></td>
      </template>
    </v-data-table>
    <editdialog :title="`Edit ${entitytype}`" ref="editdialog" @close="getRecords()">
    </editdialog>
    <v-dialog v-model="deleteDialog.status" v-if="deleteDialog.rec" max-width="500px">
      <v-card>
        <v-card-title>
          CONFIRM DELETION
        </v-card-title>
        <v-card-text>
          Do you really want to delete record <b>{{ deleteDialog.rec.name }}</b>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="deleteConfirm(deleteDialog.rec._id)" large color="error">
            DELETE
          </v-btn>
          <v-btn @click="deleteDialog.status = false" large color="secondary">
            CANCEL
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  /* eslint-disable no-underscore-dangle,no-param-reassign */
import { mapGetters, mapActions } from 'vuex';

import fundamentcard from '../Fundament/FundamentCard';
import editdialog from '../editDialog';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    components: {
      fundamentcard,
      editdialog,
    },
    props: {
      entitytype: {
        type: String,
        default: () => null,
      },
      headers: {
        type: Array,
        default: () => null,
      },
      filter: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        data: [],
        deleteDialog: {
          status: false,
          rec: null,
        },
        loading: false,
        itemOptions: [10, 20, 50, 100, 250],
        totalHits: 0,
        pagination: {},
        q: {},
      };
    },
    watch: {
      pagination: {
        handler() {
          this.getRecords();
        },
        deep: true,
      },
      filter: {
        handler(f) {
          if (f) {
            Object.keys(f).forEach((key) => {
              this.q[key] = f[key];
            });
          }
          this.getRecords();
        },
        deep: true,
      },
      entitytype: {
        handler() {
          this.getRecords();
        },
      },
    },
    methods: {
      ...mapActions('api', [
        'get',
        'post',
        'delete',
      ]),
      getRecords() {
        this.loading = true;
        this.get({
          type: this.entitytype,
          sort: this.pagination.descending ? `-${this.pagination.sortBy}` : this.pagination.sortBy,
          limit: this.pagination.rowsPerPage,
          skip: (this.pagination.page - 1) * this.pagination.rowsPerPage,
          query: this.q,
          populate: JSON.stringify(
            this.currentHeaders.filter(
              // eslint-disable-next-line no-confusing-arrow
              h => this.getPathsByName(this.entitytype).indexOf(h.value) !== -1 ? h : null,
            ).map(p => ({ path: p.value })),
          ),
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
      deleteRequest(rec) {
        this.deleteDialog.rec = rec;
        this.deleteDialog.status = true;
      },
      deleteConfirm(_id) {
        this.delete({ type: this.entitytype, id: _id }).then(() => {
          this.deleteDialog = {
            status: false,
            rec: null,
          };
          this.getRecords();
        })
        .catch(() => {
          this.getRecords();
        });
      },
    },
    computed: {
      ...mapGetters('api', [
        'getListHeadersByName',
        'getFiltersByName',
        'getPathsByName',
      ]),
      currentHeaders() {
        if (this.headers) return this.headers;
        return this.getListHeadersByName(this.entitytype);
      },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
