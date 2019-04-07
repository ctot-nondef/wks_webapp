<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <h3>{{view.name}}</h3>
      <v-data-table
        :headers="headers"
        :items="data"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.adlib }}</td>
          <td>{{ props.item._id }}</td>
          <td><v-btn :to="{ name: 'e', params: { id:  props.item._id  }}" color="info">Details</v-btn></td>
        </template>
      </v-data-table>
    </v-container>
    <v-container grid-list-md v-if="!$store.state.app.loggedin">
      Bitte loggen Sie sich ein um die Datenbank zu benutzen.
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import fundamentcard from '../Fundament/FundamentCard';
import inventorylist from '../ListViews/inventory_list';
import inventoryform from '../Forms/inventory_form';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  components: {
    fundamentcard,
    inventorylist,
    inventoryform,
  },
  data() {
    return {
      view: {},
      data: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Range', value: 'type' },
        { text: 'Type', value: 'range' },
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
      if(this.newinventory.creator) this.newinventory.creator.forEach((el, idx, c) => {
          var rel = {};
          Object.keys(el).forEach((key) => {
            rel[key] = el[key]._id || el[key];
          });
          c[idx] = rel;
        });
         if(this.newinventory.classification) this.newinventory.classification.forEach((el, idx, c) => {
          var rel = {};
          Object.keys(el).forEach((key) => {
            rel[key] = el[key]._id || el[key];
          });
          c[idx] = rel;
        });
       if(this.newinventory.place) {
          this.newinventory.place = this.newinventory.place._id
        }
         if(this.newinventory.partOf) {
          this.newinventory.partOf = this.newinventory.partOf._id
        }
      this.post({ type: 'inventory', body: this.newinventory }).then((res) => {
        this.newinventory = {};
        this.iventorydialog = false;
        this.$refs.inventorylist.getRecords();
      });
    },
  },
  computed: {
  },
  created() {
    this.get({ type: 'Collect', id: this.$route.params.id }).then((res) => {
      this.view = res.data;
    });
    this.get({ type: 'Inventory', query: `{"partOf":"${this.$route.params.id}"}` }).then((res) => {
      this.data = res.data;
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
