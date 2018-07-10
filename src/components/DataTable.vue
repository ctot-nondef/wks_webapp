<template>
  <div>
    <h3>Properties</h3>
    <v-data-table
      :headers="headers"
      :items="tabledata"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.type }}</td>
        <td>{{ props.item.range }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import HELPERS from '../helpers';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  mixins: [HELPERS],
  components: {
  },
  props: ['uri'],
  data() {
    return {
      tabledata: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Range', value: 'type' },
        { text: 'Type', value: 'range' },
      ],
    };
  },
  methods: {
    ...mapActions('jowl', [
      'fetchClasses',
      'fetchSubClassOf',
      'fetchPropertiesByURI',
    ]),
  },
  computed: {
    ...mapGetters('jowl', [
      'getQuery',
    ]),
  },
  watch: {
    uri: function getProps(newClass) {
      this.$info('DataTable', 'getProps(newClass)', newClass);
      this.tabledata = [];
      this.fetchPropertiesByURI({ q: newClass, uri: newClass }).then((res) => {
        let idx = res.length - 1;
        while (idx + 1) {
          this.tabledata.push({
            name: res[idx]['?p'].name,
            type: res[idx]['?p'].type,
            range: res[idx]['?p'].range,
          });
          idx -= 1;
        }
        this.$log('Tabledata', this.tabledata);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
