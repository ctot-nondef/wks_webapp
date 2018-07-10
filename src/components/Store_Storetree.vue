<template>
  <v-layout row wrap>
    <v-expansion-panel popout>
      <v-expansion-panel-content value="true">
        <div slot="header"><v-icon large color='teal lighten-3'>folder</v-icon> Collections / Resources</div>
        <v-card>
          <v-flex xs12 v-for="(item, i) in collections" :key="i" >
            <item @input="$emit('input', passThroughItem)"  v-model="passThroughItem" :uri="item.subject" :itemFull="item" :bg="i%2"></item>
          </v-flex>
        </v-card>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header"><v-icon large color='teal lighten-3'>person</v-icon> Persons</div>
        <v-card>
          <v-flex xs12 v-for="(item, i) in persons" :key="i" >
            <item @input="$emit('input', passThroughItem)"  v-model="passThroughItem" :uri="item.subject" :itemFull="item"  :bg="i%2"></item>
          </v-flex>
        </v-card>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header"><v-icon large color='teal lighten-3'>place</v-icon> Places</div>
        <v-card>
          <v-flex xs12 v-for="(item, i) in places" :key="i" >
            <item @input="$emit('input', passThroughItem)" v-model="passThroughItem" :uri="item.subject" :itemFull="item" :bg="i%2"></item>
          </v-flex>
        </v-card>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header"><v-icon large color='teal lighten-3'>device_hub</v-icon> Organisations</div>
        <v-card>
          <v-flex xs12 v-for="(item, i) in organisations" :key="i" >
            <item @input="$emit('input', passThroughItem)"  v-model="passThroughItem" :uri="item.subject" :itemFull="item"  :bg="i%2"></item>
          </v-flex>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import item from './Store_Storetreeitem';

import HELPERS from '../helpers';
/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  mixins: [HELPERS],
  data() {
    return {
      rootitems: [],
      collections: [],
      persons: [],
      places: [],
      organisations: [],
      passThroughItem: {},
    };
  },
  name: 'storetree',
  components: {
    item,
  },
  computed: {
    ...mapGetters('n3', [
      'getCount',
      'getTriples',
      'getTitle',
      'getType',
    ]),
  },
  watch: {
    getCount() {
      this.getRoot();
    },
  },
  methods: {
    getRoot() {
      this.collections = this.getTriples({ predicate: 'https://vocabs.acdh.oeaw.ac.at/schema#hasTitleImage' });
      this.persons = this.getTriples({ predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', object: 'https://vocabs.acdh.oeaw.ac.at/schema#Person' });
      this.places = this.getTriples({ predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', object: 'https://vocabs.acdh.oeaw.ac.at/schema#Place' });
      this.organisations = this.getTriples({ predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', object: 'https://vocabs.acdh.oeaw.ac.at/schema#Organisation' });
    },
  },
  mounted() {
    this.getRoot();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
