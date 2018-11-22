<template>
  <div class="">
    <v-text-field v-model="collection.name" label="Name" @input="returnObject()"></v-text-field>
    <autocompactor v-model="collection.collector" label="Sammler" :multiple="true" @input="collection.collector=$event;returnObject();"></autocompactor>
    <autocompplace v-model="collection.place" label="Ort" :multiple="true" @input="collection.place=$event;returnObject();"></autocompplace>
    <autocompdescriptor v-model="collection.time" label="Zeit" :multiple="false" @input="collection.time=$event;returnObject();"></autocompdescriptor>
    <v-text-field v-model="collection.beginOfExistence" label="Begin of Existence" @input="returnObject()"></v-text-field>
    <v-text-field v-model="collection.endOfExistence" label="End of Existence" @input="returnObject()"></v-text-field>
    <v-textarea v-model="collection.description" label="Beschreibung" @input="returnObject()"></v-textarea>
    <v-textarea v-model="collection.destitution" label="Verbleib" @input="returnObject()"></v-textarea>
    <v-list two-line>
      <template v-for="(item, index) in collection.references">
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.ref"></v-list-tile-title>
            <v-list-tile-sub-title v-html="item.pageno"></v-list-tile-sub-title>
          </v-list-tile-content>
          <v-btn fab dark small color="error" @click="removereference(index)">
            <v-icon dark>delete</v-icon>
          </v-btn>
        </v-list-tile>
      </template>
    </v-list>
    <v-layout justify-end row fill-height>
      <v-flex xs5>
        <v-text-field label="Reference" v-model='newreference.ref'></v-text-field>
      </v-flex>
      <v-flex xs5>
        <v-text-field label="PageNo" v-model='newreference.pageno'></v-text-field>
      </v-flex>
      <v-flex xs2>
        <v-btn fab dark small color="warning" @click="addreference()">
          <v-icon dark>edit</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import autocompactor from './AutocompActor';
import autocompplace from './AutocompPlace';
import autocompdescriptor from './AutocompDescriptor';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocompactor,
    autocompplace,
    autocompdescriptor,
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
      newreference: {},
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
    removereference(index) {
      this.collection.references.splice(index, 1);
      this.returnObject();
    },
    addreference() {
      if(!this.collection.references) this.collection.references = [];
      this.collection.references.push(this.newreference);
      this.returnObject();
      this.newreference = {};
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
