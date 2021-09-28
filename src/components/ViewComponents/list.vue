<template>
  <div class="">
    <v-data-table
      :headers="currentHeaders"
      :items="data"
      :loading="loading"
      :server-items-length="totalHits"
      :options.sync="pagination"
      :footer-props="{
        showFirstLastPage: true,
        'items-per-page-options': [10, 20, 50, 100, 250],
      }"
      class="elevation-1"
      :loading-text="loadingText"
      :no-data-text="noDataText"
    >
      <template v-slot:top="{ pagination, options, updateOptions }">
        <v-data-footer
            :pagination="pagination"
            :options="options"
            @update:options="updateOptions"
            items-per-page-text="$vuetify.dataTable.itemsPerPageText"
            :showFirstLastPage="true"
            :items-per-page-options="[10, 20, 50, 100, 250]"/>
      </template>
      <template v-slot:body="{ items }">
        <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <td v-for="column in currentHeaders" :key="column.path">
            <span v-if="_.get(item, column.path) && column.text === 'Date'">
              {{ _.get(item, column.path) | formatDate }}
            </span>
            <span v-else-if="_.get(item, column.path)">
              {{ _.get(item, column.path) }}
            </span>
            <span v-else-if="column.text === 'Actions'">
              <v-btn fab dark small :to="{ name: 'single', params: { type: entitytype, id:  item._id  }}" color="primary">
                <v-icon dark>collections_bookmark</v-icon>
              </v-btn>
              <span>
                <v-btn v-if="entitytype === 'transaction'" fab dark small color="secondary" @click="$emit('select', item)">
                  <v-icon dark>collections_bookmark</v-icon>
                </v-btn>
                <v-btn fab dark small color="warning" class="ml-1"  @click="$refs.editdialog.getItem(entitytype, item._id)" v-if="$store.state.api.loggedin">
                  <v-icon dark>edit</v-icon>
                </v-btn>
                <v-btn fab dark small color="error" class="ml-1"  @click="deleteRequest(item)" v-if="$store.state.api.loggedin">
                  <v-icon dark>delete</v-icon>
                </v-btn>
              </span>
            </span>
            <span v-else-if="!_.get(item, column.path)">
              n/a
            </span>
          </td>
        </tr>
        </tbody>
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
import filters from '../../helpers/filters';

import editdialog from '../Dialogs/editDialog';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    components: {
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
        loadingText: "Please wait, query is being processed...",
        noDataText: "No results found corresponding to your query.",
        data: [],
        deleteDialog: {
          status: false,
          rec: null,
        },
        loading: true,
        itemOptions: [10, 20, 50, 100, 250],
        totalHits: 0,
        pagination: {},
        q: {},
      };
    },
    mixins: [filters],
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
            this.q = {'$and': []};
            Object.keys(f).forEach((key) => {
              if(key.match(/^(Kunstgattung|Thema|Datierung|Schule)$/) && f[key]) {
                if(Array.isArray(f[key]) && f[key].length > 0) {
                  const qarray = { '$or': [] };
                  f[key].forEach((e) => qarray['$or'].push({'classification.descriptor': e._id}))
                  this.q['$and'].push(qarray);
                }
                else this.q['$and'].push({'classification.descriptor': f[key]._id})
              }
              else if(Array.isArray(f[key]) && f[key].length > 0) {
                const qarray = { '$or': [] };
                f[key].forEach((e) => qarray['$or'].push({[key]: e._id}))
                this.q['$and'].push(qarray);
              }
              else if(key === 'fti') {
                const terms = f[key].match(/(".*?"|[^"\s]+)(?=\s*|\s*$)/g);
                const ftiq = [];
                terms.forEach(t => {
                  ftiq.push({
                    fti: { "$regex": t.replace(/['"]+/g, ''), '$options':'i'}
                  });
                });
                this.q['$and'].push({ [f.ftioperator]:ftiq })
              }
              else if(f[key] && f[key] !== null && key !== 'ftioperator') this.q['$and'].push({[key]: f[key]._id ? f[key]._id : f[key]})
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
        'search'
      ]),
      getRecords() {
        this.loading = true;
        this.get({
          type: this.entitytype,
          sort: this.pagination.sortDesc[0] ? `-${this.pagination.sortBy[0]}` : this.pagination.sortBy[0],
          limit: this.pagination.itemsPerPage,
          skip: (this.pagination.page - 1) * this.pagination.itemsPerPage,
          query: this.q,
          populate: JSON.stringify(
            this.currentHeaders.filter(
              // eslint-disable-next-line no-confusing-arrow
              h => this.getPathsByName(this.entitytype).concat(this.getReversePathsByName(this.entitytype)).indexOf(h.value) !== -1 ? h : null,
            ).map(p => ({ path: p.value })),
          ),
        }).then((res) => {
          this.loading = false;
          console.log("loadingfinished", this.loading, JSON.stringify(this.pagination));
          this.data = res.body;
          this.totalHits = parseInt(res.headers['x-total-count'], 10);
        }).catch((err) => {
          this.loading = false;
          console.log("loadingfinished", this.loading, JSON.stringify(this.pagination));
          if (err.response && err.response.data && err.response.data.detail === 'Invalid page.') {
            this.pagination.page -= 1;
            this.getRecords();
          }
          else this.data = [];
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
        'getReversePathsByName',
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
