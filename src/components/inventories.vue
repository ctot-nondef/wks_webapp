<template>
  <div class="">
    <v-container grid-list-md >
      <fundamentcard caption="Inventories">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12 v-if="$store.state.api.loggedin">
              <v-layout justify-end row fill-height>
                <v-btn fab dark small
                       color="warning"
                       @click="$refs.createdialog.newItem('inventory', {})">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <filterlist entitytype="inventory" :filter="query" @update="query = $event.filter" :fixedtype="true"></filterlist>
            </v-flex>
            <v-flex xs12>
              <list ref="inventorylist" EntityType="inventory" :filter="query"  :headers="listheaders"></list>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <editdialog title="Create Inventory" ref="createdialog" @close="$refs.inventorylist.getRecords()">
        <template slot="form" slot-scope="props">
          <component :is="componentLoader" :value="props.item" @input="props.item=$event"></component>
        </template>
      </editdialog>
    </v-container>
  </div>
</template>

<script>
import fundamentcard from './Fundament/FundamentCard';
import list from './genericList/list';
import filterlist from './genericList/filter';
import editdialog from './editDialog';

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
      inventorydialog: false,
      newinventory: {},
      listheaders: [
        { text: 'Name', value: 'name', path: 'name' },
        { text: 'Actions' },
      ],
      query: { name: { $regex: null } },
    };
  },
  computed: {
    componentLoader() {
      return () => import('./Forms/collect_form');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
