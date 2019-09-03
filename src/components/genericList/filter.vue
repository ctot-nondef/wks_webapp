<template>
  <div class="">
    <v-card color="grey lighten-2" class="pa-4 mb-3">
      <v-layout justify-start row fill-height>
      <v-flex xs6 v-for="(value, path, index) in filter">
        <v-text-field v-if="getFieldType(path) === 'text'" v-model="filter[path]['$regex']" box :label="path" :key="index" ></v-text-field>
       </v-flex>
     </v-layout>
    </v-card>
    </div>
</template>

<script>
  /* eslint-disable no-underscore-dangle,no-param-reassign */
import { mapGetters } from 'vuex';
import fundamentcard from '../Fundament/FundamentCard';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    components: {
      fundamentcard,
    },
    props: {
      EntityType: {
        type: String,
        default: () => '',
      },
      filter: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        f: {},
      };
    },
    watch: {
      f: {
        handler(f) {
          console.log(f);
        },
        deep: true,
      },
    },
    methods: {
      clearFilter(f) {
        console.log(f);
      },
      addFilter(f) {
        console.log(f);
      },
      removeFilter(f) {
        console.log(f);
      },
    },
    computed: {
      ...mapGetters('api', [
        'getFieldType',
      ]),
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
