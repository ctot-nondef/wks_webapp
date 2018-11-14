<template>
  <div class="">
    <v-layout justify-end row fill-height>
      <v-flex xs6>
        <v-text-field v-model="actor.name" label="Name" @input="returnObject()"></v-text-field>
      </v-flex>
      <v-flex xs6>
        <v-select
          v-model="actor.instanceOf"
          :items="$store.state.api.classes.Actor"
          item-text="labels[4].label"
          item-value="_id"
          label="Type"
          @input="returnObject()"
        ></v-select>
      </v-flex>
     </v-layout>
    <!-- <autocompactor v-model="collection.collector" label="Collector" :multiple="true" @input="actor.collector=$event;returnObject();"></autocompactor> -->
    <!-- <autocompplace v-model="collection.place" label="Place" :multiple="true" @input="actor.place=$event;returnObject();"></autocompplace> -->
    <v-text-field v-model="actor.beginOfExistence" label="Begin of Existence" @input="returnObject()"></v-text-field>
    <v-text-field v-model="actor.endOfExistence" label="End of Existence" @input="returnObject()"></v-text-field>
    <v-textarea v-model="actor.description" label="Description" @input="returnObject()"></v-textarea>
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
      actor: {},
      title: '',
      description: '',
      comment: '',
      public: false,
      url: '',
    };
  },
  watch: {
    value(val) {
      this.actor = val;
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', this.actor);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
