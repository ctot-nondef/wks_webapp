<template>
  <div class="">
    <v-layout justify-end row fill-height>
      <!-- actor identifiers -->
      <chips :items="actor.identifier"/>
    </v-layout>
    <v-layout justify-start row fill-height>
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
    <v-layout justify-start row fill-height>
      <v-flex xs5>
        <!-- actor begin of existence -->
        <datecomponent v-bind:date.sync="actor.beginOfExistence" label="Begin of Existence"/>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs5>
        <!-- actor end of existence -->
        <datecomponent v-bind:date.sync="actor.endOfExistence" label="End of Existence"/>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <!-- actor description -->
        <v-textarea v-model="actor.description" label="Description" @input="returnObject()"></v-textarea>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <!-- actor related actors -->
        <formlistcomponent  :items="actor.relations" :itemprops="$store.state.api.schemas.actor.properties.relations.items.properties" :listitemstyletypes="relationitemstyletypes" label="Related Actors" nodatamessage="No relations added">
            <template slot="form" slot-scope="props">
            <v-flex xs2>
              <v-select :items="$store.state.api.schemas.actor.properties.relations.items.properties.kind.enum" label="Relation Type" v-model='props.newitem.kind'></v-select>
            </v-flex>
              <v-flex x12>
            <autocomp entity="actor" v-model="props.newitem.target"  label="Actor" :multiple="false"></autocomp>
            </v-flex>
            <v-flex xs10>
              <v-textarea v-model="props.newitem.annotation" label="Annotation" /> 
            </v-flex>
            </template>
          </formlistcomponent>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import autocomp from '../AutoCompleteComponents/Autocomp';
import formlistcomponent from '../FormComponents/FormListComponent';
import chips from '../FormComponents/Chips';
import datecomponent from '../FormComponents/DateComponent';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocomp,
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
      if (!this.actor.relations) {
        this.$set(this.actor,'relations',[]);
      }
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
