<template>
    <main class="grid-col" role="main">
      <div class="container">
        <div class="main-content row flex-xl-nowrap bg-white box-shadow element-border">
          <div class="col-12 col-md-3 col-xl-2 bd-sidebar">
            <nav class="collapse bd-links" id="bd-docs-nav">
              <div class="bd-toc-item">
                <a class="bd-toc-link" href="#">Ontology Loaded:</a>
              </div>
              <div class="bd-toc-item" v-if="this.getOntology">
                {{ this.$store.state.jowl.ontologyPath }}
              </div>
            </nav>
          </div>
          <div class="col-12 col-md-9 col-xl-10 page-content-w-sidebar">
            <div v-if="!this.getOntology" >
              <h1>Load Ontology from Disk</h1>
              <p>We'll need to modify jOWL.load() for this to work properly</p>
            </div>
            <div v-if="this.getOntology" >
              <h1>Explore Ontology</h1>
              <v-select
                v-model="selectedOntology"
                class="mb-3"
                label="Please select a Class"
                :items="getClasses()"
                item-text="?x.name"
                item-value="?x.URI"
                autocomplete>
              </v-select>
              <div>Selected: <strong>{{ selectedOntology }}</strong></div>
              <DataTable :uri="selectedOntology"></DataTable>
            </div>
          </div>
        </div>
      </div>
    </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import DataTable from './DataTable';
import HELPERS from '../helpers';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  mixins: [HELPERS],
  components: {
    DataTable,
  },
  data() {
    return {
      selectedOntology: null,
    };
  },
  methods: {
    ...mapActions('jowl', [
      'fetchClasses',
      'fetchSubClassOf',
      'fetchPropertiesByURI',
    ]),
    // convenience method to limit options to ACDH namespace classes
    getClasses() {
      this.$info('Schema', 'getClasses()');
      this.$log('latest session:', this.getLatestSession());
      const classes = this.getQuery('classes').filter((cl) => {
        if (cl['?x'].baseURI === 'https://vocabs.acdh.oeaw.ac.at/schema#') return true;
        return false;
      });
      this.$log('Classes:', classes);
      return classes;
    },
  },
  computed: {
    ...mapGetters('jowl', [
      'getQuery',
    ]),
    getOntology() {
      this.$info('Schema', 'getOntology() ->', this.$store.state.jowl.ontology);
      return this.$store.state.jowl.ontology;
    },
  },
  watch: {
    // in case the store is not yet read on created
    getOntology: function getClasses() {
      this.$info('Schema', 'getClasses()');
      this.fetchClasses({ q: 'classes' });
    },
  },
  created() {
    this.$info('Schema', 'created');
    if (this.getOntology) this.fetchClasses({ q: 'classes' });
    this.$log('last session', this.getLatestSession());
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
