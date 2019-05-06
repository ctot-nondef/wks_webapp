<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <fundamentcard :caption="view.name">
        <div slot="content">
          <v-layout justify-center column fill-height>
            <v-flex xs12>
              <inventorylist ref="inventorylist" :filter="{ parent: this.$route.params.id }"></inventorylist>
            </v-flex>
          </v-layout>
        </div>
      </fundamentcard>
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
      if (this.newinventory.creator) this.newinventory.creator.forEach((el, idx, c) => {
        var rel = {};
        Object.keys(el).forEach((key) => {
          rel[key] = el[key]._id || el[key];
        });
        c[idx] = rel;
      });
      if (this.newinventory.classification) this.newinventory.classification.forEach((el, idx, c) => {
        var rel = {};
        Object.keys(el).forEach((key) => {
          rel[key] = el[key]._id || el[key];
        });
        c[idx] = rel;
      });
      if (this.newinventory.place) {
        this.newinventory.place = this.newinventory.place._id;
      }
      if (this.newinventory.partOf) {
        this.newinventory.partOf = this.newinventory.partOf._id;
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
