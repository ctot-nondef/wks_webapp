<template>
  <div class="">
    <div
      style="width: 100%"
      grid-list-md
    >
      <fundamentcard caption="Text Search">
        <div slot="content">
          <v-layout
            justify-center
            column
            fill-height
          >
            <v-flex xs12>
              <filterlist
                :entitytype="$route.params.entity"
                :filter="query"
                fixedtype
                @update="updateParams($event)"
              />
            </v-flex>
            <v-flex xs12>
              <list
                ref="genericlist"
                :entitytype="$route.params.entity"
                :headers="headers[$route.params.entity]"
                :filter="query"
              />
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <editdialog
        ref="createdialog"
        :title="`Create ${$route.params.entity}`"
        @close="$refs.genericlist.getRecords()"
      />
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-param-reassign,no-underscore-dangle */
  import fundamentcard from './Fundament/FundamentCard';
  import list from './ViewComponents/list';
  import filterlist from './FilterComponents/filter';
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
        query: { fti: ''},
        pagination: {},
        headers: {
          entry: [
            { text: 'Name', value: 'name', path: 'name' },
            { text: 'Creator', value: 'creator.id', path: 'creator[0].id.name' },
            { text: 'Original Title', value: 'originalTitle', path: 'originalTitle' },
            { text: 'Actions' },
          ],
        },
      };
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
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
