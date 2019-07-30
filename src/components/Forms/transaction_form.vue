<template>
  <div class="">
    <!-- transaction date -->
    <v-layout justify-start row fill-height>
      <v-flex xs5>
        <datecomponent v-bind:date.sync="transaction.date" label="Created Start" @input="returnObject()"/>
      </v-flex>
    </v-layout>
    <!-- transaction price -->
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <formlistcomponent
          :items="transaction.price"
          :itemprops="$store.state.api.schemas.transaction.properties.price.items.properties"
          label="Price"
          nodatamessage="No price values added">
          <template slot="form" slot-scope="props">
            <v-layout justify-end row fill-height wrap>
              <v-flex xs6>
                <v-text-field box v-model="props.newitem.amount" label="Numerical Amount" type="number"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <autocomp entity="Descriptor" v-model="props.newitem.currency" label="Currency" :multiple="false"></autocomp>
              </v-flex>
            </v-layout>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- transaction actor -->
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <formlistcomponent
          :items="transaction.actor"
          :itemprops="$store.state.api.schemas.transaction.properties.actor.items.properties"
          label="Actor"
          nodatamessage="No actors specified added"
        >
          <template slot="form" slot-scope="props">
            <v-layout justify-end row fill-height wrap>
              <v-flex xs6>
                <autocomp entity="Descriptor" filter="ROLE" v-model="props.newitem.role" label="Role" :multiple="false"></autocomp>
              </v-flex>
              <v-flex xs6>
                <autocomp entity="Actor" v-model="props.newitem.id" label="Actor" :multiple="false"></autocomp>
              </v-flex>
              <v-flex xs12>
                <v-textarea v-model="props.newitem.note" box label="Note" />
              </v-flex>
            </v-layout>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- transaction comments -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <formlistcomponent :items="transaction.comments" label="Comments" nodatamessage="No comments added">
          <template slot="form" slot-scope="props">
          <v-flex xs5>
              <v-textarea v-model="props.newitem.textval" label="New Comment"></v-textarea>
          </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import autocomp from '../AutoCompleteComponents/Autocomp';
import simpleautocompwrapper from '../FormComponents/SimpleAutoCompleteWrapper';
import formlistcomponent from '../FormComponents/FormListComponent';
import chips from '../FormComponents/Chips';
import datecomponent from '../FormComponents/DateComponent';
/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocomp,
    simpleautocompwrapper,
    formlistcomponent,
    datecomponent,
    chips,
  },
  props: [
    'value',
  ],
  data() {
    return {
      transaction: {},
      title: '',
      description: '',
      comment: '',
      public: false,
      url: '',
    };
  },
  watch: {
    value(val) {
      this.transaction = val;
      this.initVals();
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', this.transaction);
    },
    parseDate(datestring) {
      return new Date(datestring);
    },
    initVals() {
      if (!this.transaction.price) {
        this.$set(this.transaction, 'price', []);
      }
      if (!this.transaction.actor) {
        this.$set(this.transaction, 'actor', []);
      }
      if (!this.transaction.comments) {
        this.$set(this.transaction, 'comments', []);
      }
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
