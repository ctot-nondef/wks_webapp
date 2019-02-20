<template>
  <div class="">
    <v-layout justify-end row fill-height>
      <!-- descriptor identifiers -->
      <chips :items="descriptor.identifier"/>
    </v-layout>
    <v-layout justify-end row fill-height>
      <v-flex xs6>
         <!-- Descriptor name -->
        <v-text-field v-model="descriptor.name" label="Name" @input="returnObject()"></v-text-field>
      </v-flex>
      <v-flex xs6>
        <!-- descriptor instanceOf -->
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
     <!-- descriptor description -->
     <v-textarea v-model="descriptor.description" label="Description" @input="returnObject()"></v-textarea>
     <!-- descriptor relations -->
     <formlistcomponent :items="descriptor.relations" :itemprops="$store.state.api.schemas.descriptor.properties.relations.items.properties" :listitemstyletypes="relationitemstyletypes" label="Related Descriptors" nodatamessage="No relations added">
      <template slot="form" slot-scope="props">
       <v-flex xs2>
         <v-select :items="$store.state.api.schemas.actor.properties.relations.items.properties.kind.enum" label="Relation Type" v-model='props.newitem.kind'></v-select>
       </v-flex>
        <v-flex x12>
       <autocompdescriptor v-model="selecteddescriptor"  label="Descriptor" :multiple="false" @input="props.newitem.target = selecteddescriptor;returnObject();"></autocompdescriptor>
      </v-flex>
      <v-flex xs10>
        <v-textarea v-model="props.newitem.annotation" label="Annotation" /> 
       </v-flex>
      </template>
    </formlistcomponent>
  </div>
</template>
<script>
import autocompdescriptor from '../AutoCompleteComponents/AutocompDescriptor';
import formlistcomponent from '../FormComponents/FormListComponent';
import chips from '../FormComponents/Chips';
import { mapGetters} from 'vuex';
import HELPERS from '../../helpers';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocompdescriptor,
    formlistcomponent,
    chips
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
      selecteddescriptor: {},
      relationitemstyletypes: [
        'title',
        'subtitle',
        'subtitle'
      ],
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
