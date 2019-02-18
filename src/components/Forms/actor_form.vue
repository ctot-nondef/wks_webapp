<template>
  <div class="">
    <v-layout justify-end row fill-height>
      <!-- actor identifiers -->
      <chips :items="actor.identifier"/>
    </v-layout>
    <v-layout justify-end row fill-height>
      <v-flex xs6>
        <!-- actor name -->
        <v-text-field v-model="actor.name" label="Name" @input="returnObject()"></v-text-field>
      </v-flex>
      <v-flex xs6>
        <!-- actor instanceOf -->
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
    <!-- actor begin of existence -->
    <datecomponent v-bind:date.sync="actor.beginOfExistence" label="Begin of Existence"/>
    <!-- actor end of existence -->
    <datecomponent v-bind:date.sync="actor.endOfExistence" label="End of Existence"/>
    <!-- actor description -->
    <v-textarea v-model="actor.description" label="Description" @input="returnObject()"></v-textarea>
     <!-- actor related actors -->
     <formlistcomponent :items="actor.relations" :itemprops="$store.state.api.schemas.actor.properties.relations.items.properties" :listitemstyletypes="relationitemstyletypes" label="Related Actors" nodatamessage="No relations added">
      <template slot="form" slot-scope="props">
       <v-flex xs2>
         <v-select :items="$store.state.api.schemas.actor.properties.relations.items.properties.kind.enum" label="Relation Type" v-model='props.newitem.kind'></v-select>
       </v-flex>
        <v-flex x12>
       <autocompactor v-model="selectedactor"  label="Actor" :multiple="false" @input="props.newitem.target = selectedactor._id;returnObject();"></autocompactor>
      </v-flex>
      <v-flex xs10>
        <v-textarea v-model="props.newitem.annotation" label="Annotation" /> 
       </v-flex>
      </template>
    </formlistcomponent>
  </div>
</template>
<script>
import autocompactor from '../AutoCompleteComponents/AutocompActor';
import autocompplace from '../AutoCompleteComponents/AutocompPlace';
import formlistcomponent from '../FormComponents/FormListComponent';
import chips from '../FormComponents/Chips';
import datecomponent from '../FormComponents/DateComponent';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocompactor,
    autocompplace,
    formlistcomponent,
    datecomponent,
    chips,
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
      beginofexistencemenu: false,
      endofexistencemenu: false,
      selectedactor: {},
      relationitemstyletypes: [
        'title',
        'subtitle',
        'subtitle'
      ],
    }
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
  created() {
    console.log(this.$refs);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
