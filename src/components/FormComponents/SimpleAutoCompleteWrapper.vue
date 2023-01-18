<template>
  <div>
    <v-text-field
      v-if="isEditing===false"
      v-model="model.name"
      append-outer-icon="edit"
      clearable
      readonly
      :label="label"
      @click:append-outer="isEditing = true"
      @click:clear="model={}"
    />
    <autocomp
      v-if="isEditing===true"
      v-model="model"
      :entity="entity"
      :filter="filter"
      icon="check"
      :clickevent="setEditingToRead"
      :label="label"
      :multiple="false"
      :displayitemprops="displayitemprops"
    />
  </div>
</template>
<script>
/* eslint-disable no-underscore-dangle */
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
    'displayitemprops',
  ],
  data() {
    return {
      isEditing: false,
      model: {},
    };
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && typeof val === 'object') this.model = val;
        else this.model = {};
      },
    },
    model: {
      deep: true,
      handler(val) {
        if (!val._id) this.$emit('input', null);
        else this.$emit('input', val);
      },
    },
  },
  methods: {
    setEditingToRead() {
      this.$emit('input', this.model);
      this.isEditing = false;
    },
  },
};
</script>
