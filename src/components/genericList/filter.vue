<template>
  <div class="">
    <v-card color="grey lighten-2" class="pa-4 mb-3">
      <v-select
        v-if="!fixedtype"
        :value="entitytype"
        :items="types"
        label="Type"
        @input="$emit('update', { type: $event, filter: filter })"
      ></v-select>
      <v-layout justify-start row fill-height>

        <!-- text field for regex query -->
        <v-flex xs6 v-for="(value, path, index) in filter">
          <!-- text field for regex query -->
          <v-text-field
            v-if="getFieldType({type: entitytype, name: path}) === 'string'"
            :value="value['$regex']"
            box
            :label="path"
            :key="index"
            @input="updateFilter({ key: `${path}.$regex`, value: $event })">
          </v-text-field>
          <!-- descriptor class select -->
          <v-select
            v-if="getFieldType({type: entitytype, name: path}) === 'class_descriptor'"
            :value="value"
            :items="$store.state.api.classes[entitytype.charAt(0).toUpperCase() + entitytype.slice(1)]"
            item-text="_labels[4].label"
            item-value="_id"
            label="Type"
            @input="updateFilter({ key: `${path}`, value: $event })"
          ></v-select>
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
      fixedtype: {
        type: Boolean,
        default: () => false,
      },
      entitytype: {
        type: String,
        default: () => null,
      },
      filter: {
        type: Object,
        default: () => null,
      },
    },
    data() {
      return {
      };
    },
    methods: {
      updateFilter(f) {
        const nf = JSON.parse(JSON.stringify(this.filter));
        this._.set(nf, f.key, f.value);
        this.$emit('update', { type: this.entitytype, filter: nf });
      },
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
        'types',
      ]),
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
