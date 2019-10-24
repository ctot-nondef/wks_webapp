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
      <v-layout justify-start row wrap fill-height>
        <v-flex xs6 v-for="(value, path, index) in filter" :key="index">
          <!-- text field for regex query -->
          <v-text-field
            v-if="getFieldType({type: entitytype, name: path}) === 'string'"
            :value="value['$regex']"
            box
            :label="path"
            clearable
            @click:clear="value['$regex'] = ''"
            @input="updateFilter({ key: `${path}.$regex`, value: $event })"/>
          <!-- descriptor/actor class select -->
          <v-select
            v-if="getFieldType({type: entitytype, name: path}) === 'class_descriptor'"
            :value="value"
            :items="$store.state.api.classes[entitytype.charAt(0).toUpperCase() + entitytype.slice(1)]"
            item-text="_labels[4].label"
            item-value="_id"
            label="Type"
            clearable
            @click:clear="value = {}"
            box
            @input="updateFilter({ key: `${path}`, value: $event })"/>
          <!-- simple xref select -->
          <simpleautocompwrapper
            v-if="getFieldType({type: entitytype, name: path}) === 'collect'"
            entity="Collect"
            :value="value"
            label="Part Of"
            clearable
            @click:clear="value['$regex'] = null"
            @update:prop="updateFilter({ key: `${path}`, value: $event })"/>
        </v-flex>
      </v-layout>
    </v-card>
    </div>
</template>

<script>
  /* eslint-disable no-underscore-dangle,no-param-reassign,arrow-body-style */
import { mapGetters } from 'vuex';
import fundamentcard from '../Fundament/FundamentCard';
import simpleautocompwrapper from '../FormComponents/SimpleAutoCompleteWrapper';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    components: {
      fundamentcard,
      simpleautocompwrapper,
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
        const nf = JSON.parse(
          JSON.stringify(this.filter, (k, v) => {
            return v === undefined ? null : v;
          }),
        );
        // eslint-disable-next-line max-len
        this._.set(nf, f.key, f.value && f.value._id ? { _id: f.value._id, name: f.value.name } : f.value);
        if ((!this.filter[f.key] || !f.value)) {
          this.$emit('update', { type: this.entitytype, filter: nf });
        } else if (this.filter[f.key]._id !== f.value._id) {
          this.$emit('update', { type: this.entitytype, filter: nf });
        } else if (typeof this.filter[f.key] === 'string') {
          this.$emit('update', { type: this.entitytype, filter: nf });
        }
        return null;
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
