<template>
  <div class="">
    <v-container grid-list-md >
      <fundamentcard :caption="$route.params.entity">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12 v-if="$store.state.api.loggedin">
              <v-layout justify-end row fill-height>
                <v-btn fab dark small
                       color="warning"
                       @click="$refs.createdialog.newItem($route.params.entity, {})">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <filterlist :entitytype="$route.params.entity" :filter="query" @update="updateParams($event)"></filterlist>
            </v-flex>
            <v-flex xs12>
              <list ref="genericlist" :entitytype="$route.params.entity" :filter="query" ></list>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <editdialog :title="`Create ${$route.params.entity}`" ref="createdialog" @close="$refs.genericlist.getRecords()">
      </editdialog>
    </v-container>
  </div>
</template>

<script>
  /* eslint-disable no-param-reassign,no-underscore-dangle */
  import fundamentcard from './Fundament/FundamentCard';
  import list from './ViewComponents/list';
  import filterlist from './ViewComponents/filter';
  import editdialog from './Dialogs/editDialog';

  /* eslint no-unused-vars: ["error", {"args": "none"}] */
  /* eslint no-console: ["error", { allow: ["log"] }] */

  export default {
    components: {
      fundamentcard,
      list,
      filterlist,
      editdialog,
    },
    data() {
      return {
        query: { ftsearch: ''},
        pagination: {},
      };
    },
    methods: {
      parseQuery() {
        try {
          const q = JSON.parse(this.$route.params.query);
          if (typeof q === 'object') this.query = q;
          else throw new Error('faulty query object');
        } catch (e) {
          // TODO: this might be shorter if done with vuex sync?
          // TODO: should $route.params be a computed prop with getter/setter?
          this.$router.push({
            name: 'search',
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
          name: 'search',
          params: {
            entity: a.type,
            query: JSON.stringify(a.filter),
          },
        });
        this.parseQuery();
      },
    },
    watch: {
      '$route.params': {
        handler() { this.parseQuery(); },
        immediate: true,
        deep: true,
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
