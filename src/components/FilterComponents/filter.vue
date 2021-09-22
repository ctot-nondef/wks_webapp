<template>
  <div class="">
    <v-card color="grey lighten-2" class="pa-4 mb-3">
      <v-select
        v-if="availableTypes && availableTypes.length > 0 && availableTypes.includes(entitytype)"
        :value="entitytype"
        :items="availableTypes"
        label="Type"
        @input="$emit('update', { type: $event, filter: filter })"
      />
      <v-layout justify-start row wrap fill-height>
        <v-flex xs12 v-for="(value, path) in filter" :key="path">
          <logical-group
              v-if="path === '$and' || path === '$or'"
              :key="path"
              :value="value"
          >a</logical-group>
          <!-- text field for fulltext search -->
          <v-text-field
              v-if="path == 'fti'"
              :value="value"
              filled
              label="Keywords"
              clearable
              @click:clear="value = ''"
              @input="updateFilter({ key: `${path}`, value: $event })"/>
          <!-- operator for fulltext search -->
          <v-radio-group
              :value="value"
              v-if="path == 'ftioperator'"
              @change="updateFilter({ key: `${path}`, value: $event })"
          >
            <v-radio
                key="and"
                label="and"
                value="$and"
            ></v-radio>
            <v-radio
                key="or"
                label="or"
                value="$or"
            ></v-radio>
          </v-radio-group>
        </v-flex>
        <v-flex xs6 v-for="(value, path, index) in filter" :key="index">
          <autocomp
              v-if="entitytype === 'entry' && path === 'Kunstgattung'"
              entity="descriptor"
              :value="value"
              :label="path"
              clearable
              @click:clear="value['$regex'] = null"
              @input="updateFilter({ key: `${path}`, value: $event })"/>
          <autocomp
              v-else-if="entitytype === 'entry' && path === 'Thema'"
              entity="descriptor"
              :value="value"
              :label="path"
              clearable
              @click:clear="value['$regex'] = null"
              @input="updateFilter({ key: `${path}`, value: $event })"/>
          <autocomp
              v-else-if="entitytype === 'entry' && path === 'Datierung'"
              entity="descriptor"
              :value="value"
              :label="path"
              clearable
              @click:clear="value['$regex'] = null"
              @input="updateFilter({ key: `${path}`, value: $event })"/>
          <autocomp
              v-else-if="entitytype === 'entry' && path === 'Schule'"
              entity="descriptor"
              :value="value"
              :label="path"
              clearable
              @click:clear="value['$regex'] = null"
              @input="updateFilter({ key: `${path}`, value: $event })"/>
          <!-- text field for regex query -->
          <v-text-field
            v-else-if="getFieldType({type: entitytype, name: path}) === 'string' && path !== 'fti'"
            :value="value['$regex']"
            filled
            :label="path"
            clearable
            @click:clear="value['$regex'] = ''"
            @input="updateFilter({ key: `${path}.$regex`, value: $event })"/>
          <!-- descriptor/actor class select -->
          <v-select
            v-else-if="getFieldType({type: entitytype, name: path}) === 'class_descriptor'"
            :value="value"
            :items="$store.state.api.classes[entitytype.charAt(0).toUpperCase() + entitytype.slice(1)]"
            item-text="_labels[4].label"
            item-value="_id"
            label="Type"
            clearable
            @click:clear="value = {}"
            filled
            @input="updateFilter({ key: `${path}`, value: $event })"/>
          <!-- simple xref select -->
          <autocomp
            v-else-if="getFieldType({type: entitytype, name: path}).match(/xref_(.*)/)"
            :entity="getFieldType({type: entitytype, name: path}).split('_')[1]"
            :value="value"
            :label="path"
            :multiple="true"
            clearable
            @click:clear="value['$regex'] = null"
            @input="updateFilter({ key: `${path}`, value: $event })"/>
        </v-flex>
      </v-layout>
    </v-card>
    </div>
</template>

<script>
  /* eslint-disable no-underscore-dangle,no-param-reassign,arrow-body-style */
import { mapGetters } from 'vuex';
import autocomp from '../AutoCompleteComponents/Autocomp'
import logicalGroup from "./logicalGroup";

/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
    components: {
      logicalGroup,
      autocomp,
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
      availableTypes: {
        type: Array,
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
        if (Array.isArray(f.value) && f.value.length > 0 && f.value[0]._id) f.value = f.value.map((v) => ({
          _id: v._id,
          name: v.name,
        }));
        this._.set(nf, f.key, f.value && f.value._id ? { _id: f.value._id, name: f.value.name } : f.value);
        if ((!this.filter[f.key] || !f.value)) {
          this.$emit('update', { type: this.entitytype, filter: nf });
        } else if (this.filter[f.key]._id !== f.value._id) {
          this.$emit('update', { type: this.entitytype, filter: nf });
        } else if (typeof this.filter[f.key] === 'string') {
          this.$emit('update', { type: this.entitytype, filter: nf });
        } else if (Array.isArray(this.filter[f.key]) && Array.isArray(f.value) && this.filter[f.key].length !== f.value.length) {
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
