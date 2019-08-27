<template>
  <div class="">
    <v-card color="grey lighten-2" class="pa-4 mb-3">
      <v-layout justify-start row fill-height>
      <v-flex xs6>
        <v-text-field
           v-model="namefilter"
           label="Filter By Name"
           @input="getRecords()"
           append-icon="close"
           :append-icon-cb="clearFilter"
         ></v-text-field>
       </v-flex>
     </v-layout>
    </v-card>
    </div>
</template>

<script>
  /* eslint-disable no-underscore-dangle,no-param-reassign */

import fundamentcard from '../Fundament/FundamentCard';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    components: {
      fundamentcard,
    },
    props: {
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
      clearFilted(f) {
        console.log(f);
      },
    },
    computed: {

    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
