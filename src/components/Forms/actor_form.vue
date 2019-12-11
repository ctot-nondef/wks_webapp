<template>
  <div class="">
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <gndimporter @importentity="importentity($event)" :itypes="['Person','CorporateBody']" targettype="actor"/>
      </v-flex>
    </v-layout>
    <v-layout justify-end row fill-height>
      <!-- actor identifiers -->
      <v-flex xs12>
        <v-combobox
          v-model="actor.identifier"
          chips
          filled
          multiple
          label="Identifiers"
        />
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <!-- actor name -->
        <v-text-field v-model="actor.name" label="Name" />
      </v-flex>
      <v-flex xs6>
        <!-- actor instanceOf -->
        <v-select
          v-model="actor.instanceOf"
          :items="$store.state.api.classes.Actor"
          item-text="_labels[4].label"
          item-value="_id"
          label="Type"
          @input="returnObject()"
        />
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs5>
        <!-- actor begin of existence -->
        <datecomponent :date.sync="actor.beginOfExistence" label="Begin of Existence"/>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs5>
        <!-- actor end of existence -->
        <datecomponent :date.sync="actor.endOfExistence" label="End of Existence"/>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <!-- actor description -->
        <v-textarea v-model="actor.description" label="Description" />
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <!-- actor related actors -->
        <formlistcomponent
                :items.sync="actor.relations"
                :itemprops="$store.state.api.schemas.actor.properties.relations.items.properties"
                :listitemstyletypes="relationitemstyletypes"
                label="Related Actors"
                nodatamessage="No relations added">
            <template slot="form" slot-scope="props">
            <v-flex xs2>
              <v-select :items="$store.state.api.schemas.actor.properties.relations.items.properties.kind.enum" label="Relation Type" v-model='props.newitem.kind'/>
            </v-flex>
            <v-flex x12>
              <autocomp entity="Actor" v-model="props.newitem.target"  label="Actor" :multiple="false"/>
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
import datecomponent from '../FormComponents/DateComponent';
import gndimporter from '../FormComponents/GNDImporter';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocomp,
    formlistcomponent,
    datecomponent,
    gndimporter,
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
        'subtitle',
      ],
    };
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.actor = val;
        this.initVals();
      },
    },
    actor: {
      deep: true,
      immediate: true,
      handler() {
        this.returnObject();
      },
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', this.actor);
    },
    initVals() {
      if (this.value) this.actor = Object.assign(this.value, this.actor);
      if (!this.actor.relations) {
        this.$set(this.actor, 'relations', []);
      }
    },
    importentity(e) {
      // TODO: some keys probably shouldn't be completely overwritten
      // ie all arrays should be pushed? typing validation here or in mapping?
      Object.keys(e).forEach((key) => {
        this.$set(this.actor, key, e[key]);
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
