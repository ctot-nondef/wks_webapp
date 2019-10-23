<template>
  <div class="">
    <v-container grid-list-md>
      <fundamentcard :caption="view.name">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <v-layout justify-end row fill-height>
                <v-btn fab dark small
                       color="warning"
                       @click="$refs.createdialog.newItem('inventory', { partOf: view })"
                       v-if="$store.state.api.loggedin">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <list ref="inventorylist" EntityType="inventory" :headers="listheaders" :filter="{ partOf: this.$route.params.id }"></list>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
      <editdialog title="Create Inventory" ref="createdialog" @close="$refs.inventorylist.getRecords()" v-if="$store.state.api.loggedin">
        <template slot="form" slot-scope="props">
          <component :is="componentLoader" :value="props.item" @input="props.item=$event"></component>
        </template>
      </editdialog>
    </v-container>
  </div>
</template>
<script>
import { mapActions } from 'vuex';

import fundamentcard from '../Fundament/FundamentCard';
import list from '../genericList/list';
import editdialog from '../editDialog';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  components: {
    fundamentcard,
    list,
    editdialog,
  },
  data() {
    return {
      view: {},
      data: [],
      listheaders: [
        { text: 'Name', value: 'name', path: 'name' },
        { text: 'Actions' },
      ],
      inventorydialog: false,
      newinventory: {},
    };
  },
  methods: {
    ...mapActions('api', [
      'get',
      'post',
      'delete',
    ]),
    addInventory() {
      this.post({ type: 'inventory', body: this.newinventory }).then((res) => {
        this.newinventory = {
          partOf: this.view,
        };
        this.inventorydialog = false;
        this.$refs.inventorylist.getRecords();
      });
    },
  },
  computed: {
    componentLoader() {
      return () => import('../Forms/inventory_form');
    },
  },
  created() {
    this.get({ type: 'Collect', id: this.$route.params.id }).then((res) => {
      this.view = res.data;
      this.newinventory = {
        partOf: res.data,
      };
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
