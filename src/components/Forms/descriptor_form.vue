<template>
  <div class="">
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <gndimporter @importentity="importentity($event)" :itypes="['PlaceOrGeographicName','SubjectHeading']" targettype="actor"/>
      </v-flex>
    </v-layout>
    <v-layout justify-end row fill-height>
      <!-- descriptor identifiers -->
      <v-flex xs12>
        <v-combobox
          v-model="descriptor.identifier"
          chips
          filled
          multiple
          label="Identifiers"
        />
      </v-flex>
    </v-layout>
    <v-layout justify-end row fill-height>
      <v-flex xs6>
         <!-- Descriptor name -->
        <v-text-field v-model="descriptor.name" label="Name" />
      </v-flex>
      <v-flex xs6>
        <!-- descriptor instanceOf -->
        <v-select
          v-model="descriptor.instanceOf"
          :items="$store.state.api.classes.Descriptor"
          item-text="_labels[4].label"
          item-value="_id"
          label="Type"
        />
      </v-flex>
    </v-layout>
    <!-- descriptor labels -->
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <formlistcomponent
            :items.sync="descriptor.labels"
            :itemprops="$store.state.api.schemas.descriptor.properties.labels.items.properties"
            label="Labels"
            nodatamessage="No labels added"
        >
          <template slot="form" slot-scope="props">
            <v-layout justify-end row fill-height wrap>
              <v-flex xs6>
                <v-select
                    v-model="props.newitem.lang"
                    filled
                    label="Language"
                    :items="['en','de','un']"
                />
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model="props.newitem.label" filled label="Label" />
              </v-flex>
            </v-layout>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <!-- descriptor description -->
        <v-textarea height="200" v-model="descriptor.description" label="Description"/>
      </v-flex>
    </v-layout>
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <!-- descriptor relations -->
        <formlistcomponent :items.sync="descriptor.relations" :itemprops="$store.state.api.schemas.descriptor.properties.relations.items.properties" :listitemstyletypes="relationitemstyletypes" label="Related Descriptors" nodatamessage="No relations added">
          <template slot="form" slot-scope="props">
          <v-flex xs2>
            <v-select :items="$store.state.api.schemas.actor.properties.relations.items.properties.kind.enum" label="Relation Type" v-model='props.newitem.kind'/>
          </v-flex>
            <v-flex x12>
          <autocomp entity="Descriptor" v-model="props.newitem.target"  label="Descriptor" :multiple="false"/>
          </v-flex>
          <v-flex xs10>
            <v-textarea height="200" v-model="props.newitem.annotation" label="Annotation" />
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
import gndimporter from '../FormComponents/GNDImporter';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocomp,
    formlistcomponent,
    gndimporter,
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
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.descriptor = val;
        this.initVals();
      },
    },
    descriptor: {
      deep: true,
      immediate: true,
      handler() {
        this.returnObject();
      },
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', this.descriptor);
    },
    initVals() {
      if (this.value) this.descriptor = Object.assign(this.value, this.descriptor);
      if (!this.descriptor.relations) {
        this.$set(this.descriptor, 'relations', []);
      }
      if (!this.descriptor.labels) {
        this.$set(this.descriptor, 'labels', []);
      }
    },
    importentity(e) {
      // TODO: some keys probably shouldn't be completely overwritten
      // ie all arrays should be pushed? typing validation here or in mapping?
      Object.keys(e).forEach((key) => {
        this.$set(this.descriptor, key, e[key]);
      });
      this.returnObject();
    },
  },
  mounted() {
    this.initVals();
    this.returnObject();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
