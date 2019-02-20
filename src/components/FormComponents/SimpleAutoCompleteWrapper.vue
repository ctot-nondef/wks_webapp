<template>
  <div>
    <v-text-field  append-outer-icon="edit" @click:append-outer="isEditing = true" v-if="model  && isEditing===false"  v-model="model.name" clearable readonly :label="label"></v-text-field>
    <autocompcollection v-if="autocompletetype==='collection' && isEditing===true" icon="check" v-model="model" :clickevent="setEditingToRead" @input="updateval"  :label="label" :multiple="false">
    </autocompcollection>
    <autocompdescriptor :filter="filter" v-if="autocompletetype==='descriptor' && isEditing===true" icon="check" :clickevent="setEditingToRead"  v-model="model" :label="label" :multiple="false">
    </autocompdescriptor>
  </div>
</template>
<script>
import axios from 'axios';
import autocompdescriptor from '../AutoCompleteComponents/AutocompDescriptor';
import autocompcollection from '../AutoCompleteComponents/AutocompCollection';
import { mapActions } from 'vuex';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocompdescriptor,
    autocompcollection,
  },
  props: [
    'autocompletetype',
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
