<template>
  <div class="">
    <v-container grid-list-md v-if="$store.state.app.loggedin">
      <v-form >
        <v-select
          v-model="db"
          :items="dboptions"
          :rules="[v => !!v || 'Item is required']"
          label="Database"
          required
        ></v-select>
        <v-text-field
          v-model="query"
          label="Query"
          required
        ></v-text-field>
        <v-btn
          @click="getRecords"
        >
          submit
        </v-btn>
      </v-form>
      <h3>Import</h3>
      <v-data-table
        :headers="headers"
        :items="tabledata"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.priref }}</td>
          <td>{{ props.item.title }}</td>
          <td v-if="props.item.parts_reference">{{ props.item.parts_reference.length }}</td>
        </template>
      </v-data-table>
      <v-btn @click="importRecords">IMPORT</v-btn>
      <div class="">
        <v-select
          v-model="target"
          :items="Object.keys($store.state.api.schemas)"
          label="Target Collection"
          required
        ></v-select>
        Imported {{ done }} of {{ tabledata.length }} records.
      </div>
    </v-container>
    <v-container grid-list-md v-if="!$store.state.app.loggedin">
      Bitte loggen Sie sich ein um die Datenbank zu benutzen.
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import HELPERS from '../helpers';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  mixins: [HELPERS],
  components: {
  },
  data() {
    return {
      target: '',
      done: 0,
      db: '',
      query: '',
      dboptions: ['collect', 'people', 'thesau'],
      tabledata: [],
      headers: [
        { text: 'ID', value: 'priref' },
        { text: 'Title', value: 'title' },
        { text: 'Parts', value: 'parts' },
      ],
    };
  },
  computed: {
    ...mapGetters('api', [
      'types',
    ]),
  },
  methods: {
    ...mapActions('api', [
      'get',
      'post',
      'delete',
    ]),
    getRecords() {
      this.getAdlibRecordsByQuery(this.db, this.query).then((res) => {
        this.tabledata = res.adlibJSON.recordList.record;
      });
    },
    importRecords() {
      for (let i = 0; i < this.tabledata.length; i++) {
        // first check if it's already there
        const r = this.tabledata[i];
        this.checkIfPresent(this.target, this.db, r.priref[0])
        .then((res) => {
          if (res.data.length === 0) {
            const mr = this.mapRecord(this.db, this.target, r);
            this.post({
              type: this.target,
              body: mr,
            });
          }
        }, r);
      }
    },
    checkIfPresent(type, source, priref) {
      return this.get({
        type,
        query: `{"adlib":"${source}_${priref}"}`,
      });
    },
  },
  created() {

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
