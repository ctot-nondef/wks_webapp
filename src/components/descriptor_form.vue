<template>
  <div class="">
    <v-layout justify-end row fill-height>
      <v-flex xs6>
        <v-text-field v-model="descriptor.name" label="Name" @input="returnObject()"></v-text-field>
      </v-flex>
      <v-flex xs6>
        <v-select
          v-model="descriptor.instanceOf"
          :items="$store.state.api.classes.Descriptor"
          item-text="labels[4].label"
          item-value="_id"
          label="Type"
          @input="returnObject()"
        ></v-select>
      </v-flex>
     </v-layout>
     <v-list two-line>
       <template v-for="(item, index) in descriptor.labels">
         <v-list-tile>
           <v-list-tile-content>
             <v-list-tile-title v-html="item.label"></v-list-tile-title>
             <v-list-tile-sub-title v-html="item.lang"></v-list-tile-sub-title>
           </v-list-tile-content>
           <v-btn fab dark small color="error" @click="removelabel(index)">
             <v-icon dark>delete</v-icon>
           </v-btn>
         </v-list-tile>
       </template>
     </v-list>
     <v-layout justify-end row fill-height>
       <v-flex xs8>
         <v-text-field label="Label" v-model='newlabel.label'></v-text-field>
       </v-flex>
       <v-flex xs2>
         <v-select v-model="newlabel.lang" :items="['en','de']" label="Language"></v-select>
       </v-flex>
       <v-flex xs2>
         <v-btn fab dark small color="warning" @click="addlabel()">
           <v-icon dark>edit</v-icon>
         </v-btn>
       </v-flex>
      </v-layout>
     <v-textarea v-model="descriptor.description" label="Description" @input="returnObject()"></v-textarea>
  </div>
</template>
<script>
import autocompdescriptor from './AutocompDescriptor';
import autocompplace from './AutocompPlace';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocompdescriptor,
    autocompplace,
  },
  props: [
    'value',
  ],
  data() {
    return {
      descriptor: {},
      title: '',
      description: '',
      comment: '',
      public: false,
      url: '',
      newlabel: {lang: 'de'},
    };
  },
  watch: {
    value(val) {
      this.descriptor = val;
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', this.descriptor);
    },
    removelabel(index) {
      this.descriptor.labels.splice(index, 1);
      this.returnObject();
    },
    addlabel() {
      if(!this.descriptor.labels) this.descriptor.labels = [];
      this.descriptor.labels.push(this.newlabel);
      this.returnObject();
      this.newlabel = {};
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
