<template>
  <div class="">
    <v-container grid-list-md >
      <fundamentcard caption="Database Query">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12 v-if="$store.state.app.loggedin">
              <v-layout justify-end row fill-height>
                <v-btn fab dark small color="warning" @click="creationdialog=true">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <filterlist :entitytype="$route.params.entity" :filter="query" @update="updateParams($event)" :fixedtype="false"></filterlist>
            </v-flex>
            <v-flex xs12>
              <list ref="resultlist" :EntityType="$route.params.entity" :filter="query" :headers="listheaders" ></list>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <v-layout column justify-space-between>
        <v-dialog
          v-model="creationdialog"
          @keydown.esc="creationdialog=false"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click.native="creationdialog=false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Create Collection</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
              </v-toolbar-items>
              <v-btn color="warning" @click="addItem()">Save</v-btn>
            </v-toolbar>
            <v-container grid-list-md text-xs-center>
              <v-card color="grey lighten-2" class="pa-4">
                <collectionform v-if="$store.state.api.schemas.collect" :value="newitem" @input="newitem=$event"></collectionform>
                <v-layout justify-end row fill-height>
                  <v-btn color="warning" @click="addItem()">Save</v-btn>
                  <v-btn color="primary" flat @click.native="creationdialog=false">Discard</v-btn>
                </v-layout>
              </v-card>
            </v-container>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  /* eslint-disable no-param-reassign,no-underscore-dangle */

import { mapActions, mapGetters } from 'vuex';
import fundamentcard from './Fundament/FundamentCard';
import list from './genericList/list';
import filterlist from './genericList/filter';
import collectionform from './Forms/collect_form';


/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    components: {
      fundamentcard,
      collectionform,
      list,
      filterlist,
    },
    data() {
      return {
        creationdialog: false,
        newitem: {},
        listheaders: [
          { text: 'Name', value: 'name', path: 'name' },
          { text: 'Actions' },
        ],
        query: {},
        pagination: {},
      };
    },
    methods: {
      ...mapActions('api', [
        'get',
        'post',
        'delete',
      ]),
      addItem() {
        // TODO: param validation
        this.post({ type: this.query.type, body: this.newitem }).then((res) => {
          this.newitem = {};
          this.creationdialog = false;
          this.$refs.resultlist.getRecords();
        });
      },
      parseQuery() {
        try {
          const q = JSON.parse(this.$route.params.query);
          if (typeof q === 'object') this.query = q;
          else throw new Error('faulty query object');
        } catch (e) {
          // TODO: this might be shorter if done with vuex sync?
          this.$router.push({
            name: 'query',
            params: {
              entity: this.$route.params.entity,
              query: '{}',
            },
          });
        }
      },
      updateParams(a) {
        this.query = a.filter;
        this.$router.push({
          name: 'query',
          params: {
            entity: a.type,
            query: JSON.stringify(a.filter),
          },
        });
        this.parseQuery();
      },
    },
    mounted() {
      this.parseQuery();
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
