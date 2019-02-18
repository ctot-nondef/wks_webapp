<template>
  <div class="">
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <v-text-field v-model="object.name" label="Name" @input="returnObject()"></v-text-field>
      </v-flex>
     </v-layout>
    <autocompactor v-model="object.currentOwner" :parententity="object._id" label="Current Owners" :multiple="true"></autocompactor>
    <!--<formlistcomponent :items="object.currentOwner" type="simple" label="Current Owners" nodatamessage="No owners added">
      <template slot="listelement" slot-scope="props">
          {{props}}
        <v-list-tile-title v-html="props.item">type {{typeof props.item}}</v-list-tile-title>
      </template>
      <template slot="form" slot-scope="props">
        <v-flex xs12>
       <autocompactor v-model="selectedactor"  label="Actor" :multiple="false" @input="props.newitem = selectedactor._id;returnObject();"></autocompactor>
      </v-flex>
      </template>
    </formlistcomponent>-->
    <datecomponent ref="datecomp" :dates="[object.created_start,object.created_end]"  :labels="objectdaterangelabels" mask="####-##-##"/>
    
     <!-- <v-text-field v-model="actor.beginOfExistence" label="Begin of Existence" @input="returnObject()"></v-text-field>
    <v-text-field v-model="actor.endOfExistence" label="End of Existence" @input="returnObject()"></v-text-field>-->
    <v-textarea v-model="object.description" label="Description" @input="returnObject()"></v-textarea>
  </div>
</template>
<script>
import autocompactor from '../AutoCompleteComponents/AutocompActor';
import autocompplace from '../AutoCompleteComponents/AutocompPlace';
import formlistcomponent from '../FormComponents/FormListComponent';
import datecomponent from '../FormComponents/DateComponent';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocompactor,
    autocompplace,
    formlistcomponent,
    datecomponent,
  },
  props: [
    'value',
  ],
  data() {
    return {
      object: {},
      title: '',
      description: '',
      comment: '',
      public: false,
      url: '',
      beginofexistencemenu: false,
      endofexistencemenu: false,
      selectedactor: {},
      objectdaterangelabels: [
        'Created Start',
        'Created End',
      ],
    }
  },
  watch: {
    value(val) {
      this.object = val;
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', this.object);
    },
    parseDate(datestring) {
      return new Date(datestring);
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
