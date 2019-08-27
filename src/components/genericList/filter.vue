<template>
  <div class="">
    <v-card color="grey lighten-2" class="pa-4 mb-3">
      <v-layout justify-start row fill-height>
      <v-flex xs6 v-for="f in Object.keys(filter)">
        <component :is="componentLoader" :value="props.item" @input="props.item=$event"></component>
       </v-flex>
     </v-layout>
    </v-card>
    </div>
</template>

<script>
  /* eslint-disable no-underscore-dangle,no-param-reassign */
import { mapGetters } from 'vuex';
import fundamentcard from '../Fundament/FundamentCard';
import filteritem from './filter_item_text';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    components: {
      fundamentcard,
      filteritem,
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
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
