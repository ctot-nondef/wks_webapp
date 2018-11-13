<template>
  <div class="">
    <v-text-field v-model="collection.name" label="Name" @input="returnObject()"></v-text-field>
    <autocompactor v-model="collection.collector" label="Collector" :multiple="true" @input="collection.collector=$event;returnObject();"></autocompactor>
    <autocompplace v-model="collection.place" label="Place" :multiple="true" @input="collection.place=$event;returnObject();"></autocompplace>
    <v-text-field v-model="collection.beginOfExistence" label="Begin of Existence" @input="returnObject()"></v-text-field>
    <v-text-field v-model="collection.endOfExistence" label="End of Existence" @input="returnObject()"></v-text-field>
    <v-textarea v-model="collection.description" label="Description" @input="returnObject()"></v-textarea>
  </div>
</template>
<script>
import autocompactor from './AutocompActor';
import autocompplace from './AutocompPlace';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocompactor,
    autocompplace,
  },
  props: [
    'value',
  ],
  data() {
    return {
      collection: {},
      title: '',
      description: '',
      comment: '',
      public: false,
      url: '',
    };
  },
  watch: {
    value(val) {
      this.collection = val;
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', this.collection);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
