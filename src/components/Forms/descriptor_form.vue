<template>
  <div class="">
    <v-layout justify-end row fill-height>
      <!-- descriptor identifiers -->
      <v-flex xs12>
        <v-combobox
          v-model="descriptor.identifier"
          chips
          box
          multiple
          label="Identifiers"
        ></v-combobox>
      </v-flex>
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
          item-text="_labels[4].label"
          item-value="_id"
          label="Type"
          @input="returnObject()"
        ></v-select>
      </v-flex>
    </v-layout>
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <!-- descriptor description -->
        <v-textarea v-model="descriptor.description" label="Description" @input="returnObject()"></v-textarea>
      </v-flex>
    </v-layout>
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <!-- descriptor relations -->
        <formlistcomponent :items="descriptor.relations" :itemprops="$store.state.api.schemas.descriptor.properties.relations.items.properties" :listitemstyletypes="relationitemstyletypes" label="Related Descriptors" nodatamessage="No relations added">
          <template slot="form" slot-scope="props">
          <v-flex xs2>
            <v-select :items="$store.state.api.schemas.actor.properties.relations.items.properties.kind.enum" label="Relation Type" v-model='props.newitem.kind'></v-select>
          </v-flex>
            <v-flex x12>
          <autocomp entity="Descriptor" v-model="props.newitem.target"  label="Descriptor" :multiple="false"></autocomp>
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

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocomp,
    formlistcomponent,
    chips,
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
      relationitemstyletypes: [
        'title',
        'subtitle',
        'subtitle',
      ],
    };
  },
  watch: {
    value(val) {
      this.descriptor = val;
      if (!this.descriptor.relations) {
        this.$set(this.descriptor, 'relations', []);
      }
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
