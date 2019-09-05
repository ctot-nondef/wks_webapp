<template>
  <div>
    <v-text-field  append-outer-icon="edit" @click:append-outer="isEditing = true" v-if="isEditing===false"  v-model="model.name" clearable readonly :label="label"></v-text-field>
    <autocomp :entity="entity" :filter="filter" v-if="isEditing===true" icon="check" v-model="model" :clickevent="setEditingToRead" @input="updateval"  :label="label" :multiple="false">
    </autocomp>
  </div>
</template>
<script>
import autocomp from '../AutoCompleteComponents/Autocomp';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocomp,
  },
  props: [
    'entity',
    'filter',
    'label',
    'value',
  ],
  data() {
    return {
      isEditing: false,
      model: {},
    };
  },
  watch: {
    value(val) {
      if(val &&  typeof val === 'object') this.model = val;
      else this.model = {};
    },
  },
  methods: {
    setEditingToRead() {
      this.updateval(this.model);
      this.isEditing = false;
    },
    updateval(val) {
      this.$emit('update:prop', val);
    },
  },
};
</script>
