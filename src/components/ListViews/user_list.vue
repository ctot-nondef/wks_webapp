<template>
  <div class="">
    <v-flex xs12>
      <v-layout
        justify-end
        row
        fill-height
      >
        <v-btn
          fab
          dark
          small
          color="warning"
          :disabled="true"
          @click="edituser($store.state.api.user.username)"
        >
          <v-icon dark>
            edit
          </v-icon>
        </v-btn>
      </v-layout>
    </v-flex>
    <v-data-table
      :headers="headers"
      :items="data"
      :loading="loading"
      :server-items-length="totalHits"
      :options.sync="pagination"
      :footer-props="{
        showFirstLastPage: true,
        'items-per-page-options': [10, 20, 50, 100, 250],
      }"
      class="elevation-1"
    >
      <v-progress-linear
        slot="progress"
        color="blue"
        indeterminate
      />
      <template
        slot="items"
        slot-scope="props"
      >
        <td>{{ props.item.username }}</td>
        <td>{{ props.item.firstName }}</td>
        <td>{{ props.item.lastName }}</td>
        <td>
          <span>
            <v-btn
              fab
              dark
              small
              color="warning"
              @click="edituser(props.item._id)"
            >
              <v-icon dark>edit</v-icon>
            </v-btn>
            <v-btn
              fab
              dark
              small
              color="error"
              @click="deleteuser(props.item._id)"
            >
              <v-icon dark>delete</v-icon>
            </v-btn>
          </span>
        </td>
      </template>
    </v-data-table>
    <v-layout
      column
      justify-space-between
    >
      <v-dialog
        v-model="userdialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
        @keydown.esc="userdialog=false"
      >
        <v-card>
          <v-toolbar
            dark
            color="primary"
          >
            <v-btn
              icon
              dark
              @click.native="userdialog=false"
            >
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Edit user</v-toolbar-title>
          </v-toolbar>
          <v-container
            grid-list-md
            text-xs-center
          >
            <v-card
              color="grey lighten-2"
              class="pa-4"
            >
              <userform
                :value="cedit"
                @input="cedits=$event"
              />
              <v-layout
                justify-end
                row
                fill-height
              >
                <v-btn
                  color="warning"
                  @click="saveuser()"
                >
                  Save
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click.native="userdialog=false"
                >
                  Discard
                </v-btn>
              </v-layout>
            </v-card>
          </v-container>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  /* eslint-disable no-param-reassign,no-underscore-dangle */
import { mapMutations, mapActions } from 'vuex';
import userform from '../Forms/user_form';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    components: {
      userform,
    },
    data() {
      return {
        data: [],
        cedit: {},
        cedits: {},
        userdialog: false,
        loading: false,
        itemOptions: [10, 20, 50],
        totalHits: 0,
        classfilter: '',
        namefilter: '',
        headers: [
          { text: 'username', value: 'username' },
          { text: 'First Name', value: 'firstName' },
          { text: 'Last Name', value: 'lastName' },
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
        'patch',
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
          type: 'User',
          sort: this.pagination.descending ? `-${this.pagination.sortBy}` : this.pagination.sortBy,
          limit: this.pagination.rowsPerPage,
          skip: (this.pagination.page - 1) * this.pagination.rowsPerPage,
          populate: JSON.stringify([
            { path: 'instanceOf' },
          ]),
          query: q,
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
      edituser(_id) {
        this.get({
          type: 'user',
          query: { 'username': _id },
        }).then((res) => {
          delete res.data[0].password;
          this.cedit = res.data[0];
          this.userdialog = true;
        });
      },
      saveuser() {
        if (this.cedit._id) {
          if (this.cedit.relations) {
            this.cedit.relations.forEach((el, idx, c) => {
              const rel = {};
              Object.keys(el).forEach((key) => {
                if (el[key]) {
                  rel[key] = el[key]._id || el[key];
                }
              });
              c[idx] = rel;
            });
          }
          this.patch({ type: 'user', id: this.cedit._id, body: this.cedit }).then((res) => {
            this.getRecords();
          });
        }
        this.userdialog = false;
      },
      deleteuser(_id) {
        this.delete({ type: 'user', id: _id }).then((res) => {
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
      usercheck(username) {
        console.log(username, this.$store.state.api.user.username);
        if (username === this.$store.state.api.user.username) return false;
        else if (this.$store.state.api.user.admin) return false;
        return true;
      },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
