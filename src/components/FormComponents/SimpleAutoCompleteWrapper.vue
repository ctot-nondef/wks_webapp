<template>
  <div>
    <v-text-field  append-outer-icon="edit" @click:append-outer="isEditing = true" v-if="model  && isEditing===false"  v-model="model.name" clearable readonly :label="label"></v-text-field>
    <autocomp :entity="entity" :filter="filter" v-if="isEditing===true" icon="check" v-model="model" :clickevent="setEditingToRead" @input="updateval"  :label="label" :multiple="false">
    </autocomp>
  </div>
</template>
<script>
import axios from 'axios';
import autocomp from '../AutoCompleteComponents/Autocomp';
import { mapActions } from 'vuex';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocomp
  },
  props: [
    'entity',
    'filter',
    'label',
    'value',
  ],
  data() {
    return {
        isEditing:false,
        model:{}
    };
  },
  watch: {
      value(val) {
         this.model = val;
      }
  },
  methods: {
    setEditingToRead() {
      this.updateval(this.model);
      this.isEditing = false;
    },
    updateval(val){
        this.$emit("update:prop",val);
    }
  },
};
</script>    
