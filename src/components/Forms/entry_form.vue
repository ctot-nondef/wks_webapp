<template>
  <div class="">
    <v-layout justify-end row fill-height>
      <!-- entry identifiers -->
      <chips :items="entry.identifier"/>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs10>
      <!-- entry name -->
        <v-text-field v-model="entry.name" box label="Name" class="nameinput" @input="returnObject"></v-text-field>
      </v-flex>
    </v-layout>
    <!-- entry partOf -->
    <!-- entry original title -->
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <v-text-field v-model="entry.originalTitle" box label="Original Title" @input="returnObject"></v-text-field>
      </v-flex>
      <v-flex xs6>
        <simpleautocompwrapper entity="inventory" box v-model="entry.partOf" v-bind:prop.sync="entry.partOf" label="Part Of Inventory"/>
      </v-flex>
    </v-layout>
    <!-- entry creators -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <formlistcomponent
          :items="entry.creator"
          :itemprops="$store.state.api.schemas.entry.properties.creator.items.properties"
          label="Creator"
          nodatamessage="No creators added"
        >
          <template slot="form" slot-scope="props">
            <v-flex xs6>
              <autocomp entity="Actor" v-model="props.newitem.id" label="Creator" :multiple="false"></autocomp>
            </v-flex>
            <v-flex xs6>
              <autocomp entity="Descriptor" filter="ROLE" v-model="props.newitem.role" label="Role" :multiple="false"></autocomp>
            </v-flex>
            <v-flex xs12>
              <v-textarea  box height="70" v-model="props.newitem.note" label="Note" />
            </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- entry transscription -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <v-textarea v-model="entry.transscription" label="Transscription" @input="returnObject" box></v-textarea>
      </v-flex>
    </v-layout>
     <!-- entry material -->
    <!-- entry technique -->
     <v-layout justify-start row fill-height>
       <v-flex xs6>
         <autocomp entity="Descriptor" filter="MATER" v-model="entry.material" label="Material" :multiple="true" @input="returnObject()"></autocomp>
      </v-flex>
     <v-flex xs6>
       <autocomp entity="Descriptor" filter="TECHN" v-model="entry.technique" label="Technique" :multiple="true" @input="returnObject()"></autocomp>
     </v-flex>
    </v-layout>
    <!-- entry dimensions -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <formlistcomponent
          :items="entry.dimensions"
          :itemprops="$store.state.api.schemas.entry.properties.dimensions.items.properties"
          label="Dimensions"
          nodatamessage="No dimensions added"
          :simpleformavail="true">
          <template slot="form" slot-scope="props">
            <v-flex xs4>
              <v-text-field box v-model.number="props.newitem.amount" label="Amount"></v-text-field>
            </v-flex>
            <v-flex xs4>
              <autocomp entity="Descriptor" filter="UNIT" v-model="props.newitem.unit" label="Unit" :multiple="false"></autocomp>
            </v-flex>
            <v-flex xs4>
              <autocomp entity="Descriptor" filter="DIM" v-model="props.newitem.aspect" label="Aspect" :multiple="false"></autocomp>
            </v-flex>
          </template>
          <template slot="simpleform" slot-scope="simpleprops">
            <v-flex xs6>
              <v-text-field
                box
                label="Height in mm"
                @input="simpleprops.newitems[0] = {amount: parseInt($event, 10), aspect: {name: 'Höhe', _id: '5c90a0119ca403074db61853'}, unit: {name: 'mm', _id: '5c90a0119ca403074db6197c'}}"/>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                box
                label="Width in mm"
                @input="simpleprops.newitems[1] = {amount: parseInt($event, 10), aspect: {name: 'Breite', _id: '5c90a0119ca403074db61856'}, unit: {name: 'mm',_id: '5c90a0119ca403074db6197c'}}"/>
            </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- entry created start -->
    <!-- entry created end -->
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <datecomponent v-bind:date.sync="entry.created_start" label="Created Start"/>
      </v-flex>
      <v-flex xs6>
        <datecomponent v-bind:date.sync="entry.created_end" label="Created End"/>
      </v-flex>
    </v-layout>
    <!-- entry related entries -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <formlistcomponent  :items="entry.relations" :itemprops="$store.state.api.schemas.entry.properties.relations.items.properties" label="Related Entries" nodatamessage="No relations added">
          <template slot="form" slot-scope="props">
            <v-flex xs2>
              <v-select box :items="$store.state.api.schemas.entry.properties.relations.items.properties.kind.enum" label="Relation Type" v-model='props.newitem.kind'></v-select>
            </v-flex>
            <v-flex x12>
              <autocomp entity="Entry" v-model="props.newitem.target"  label="Entry" :multiple="false" :displayitemprops="autcompdisplayprops"></autocomp>
            </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- entry identified object -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <simpleautocompwrapper entity="Object" v-model="entry.identification" v-bind:prop.sync="entry.identification" label="Identified Object" :displayitemprops="autcompdisplayprops"/>
      </v-flex>
    </v-layout>
    <!-- entry transaction -->
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <formlistcomponent
          :items="entry.transaction"
          :itemprops="$store.state.api.schemas.entry.properties.transaction.items.properties"
          label="Transactions"
          nodatamessage="No transactions linked to this entry"
        >
          <template slot="form" slot-scope="props">
            <v-layout justify-end row fill-height wrap>
              <v-flex xs6 v-if="!props.newitem.ref || !props.newitem.ref._id">
                <v-btn color="warning" @click='transactiondialog=true'>Add or link Transaction</v-btn>
              </v-flex>
              <v-flex v-if="props.newitem.ref && props.newitem.ref._id" xs6 >
                <v-btn color="warning" :to="{ name: 'transactionsingle', params: { id:  props.newitem.ref._id, edit: true  }}">Edit linked Transaction</v-btn>
              </v-flex>
              <v-flex xs6>
                <autocomp entity="Descriptor" v-model="props.newitem.type" label="Type" :multiple="false"></autocomp>
              </v-flex>
            </v-layout>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
     <!-- entry classifications -->
    <v-layout justify-start row fill-height>
      <v-flex xs12 class="mt-3">
        <formlistcomponent
          :items="entry.classification"
          :itemprops="$store.state.api.schemas.entry.properties.classification.items.properties"
          label="Classification"
          nodatamessage="No classifications added"
          :simpleformavail="true">
          <template slot="form" slot-scope="props">
            <v-flex xs6>
              <autocomp entity="Descriptor" filter="KEYWORD" v-model="props.newitem.aspect" label="Aspect" :multiple="false"></autocomp>
            </v-flex>
            <v-flex xs6>
              <autocomp entity="Descriptor" v-model="props.newitem.descriptor" label="Descriptor" :multiple="false"></autocomp>
            </v-flex>
            <v-flex xs12>
              <v-textarea box v-model="props.newitem.note" label="Note" />
            </v-flex>
          </template>
          <template slot="simpleform" slot-scope="simpleprops">
            <v-flex xs6>
              <autocomp
                entity="Descriptor"
                filter="KEYWORD"
                label="Kunstgattung"
                :multiple="false"
                @input="simpleprops.newitems[0] = {descriptor: $event, aspect: {name: 'Kunstgattung', _id: '5d5a5af4166362001326d66d'}, note: 'entered via quickform'}"
              ></autocomp>
            </v-flex>
            <v-flex xs6>
              <autocomp
                entity="Descriptor"
                filter="KEYWORD"
                label="Thema"
                :multiple="false"
                @input="simpleprops.newitems[1] = {descriptor: $event, aspect: {name: 'Thema', _id: '5d5a5c0e166362001326d670'}, note: 'entered via quickform'}"
              ></autocomp>
            </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
     <!-- entry comments -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <formlistcomponent v-if="entry.comments" :items="entry.comments" label="Comments" nodatamessage="No comments added">
          <template slot="form" slot-scope="props">
          <v-flex xs12>
              <v-textarea v-model="props.newitem.textval" box label="New Comment"></v-textarea>
          </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- transaction selection popup -->
    <v-layout column justify-space-between>
      <v-dialog
        v-model="transactiondialog"
        @keydown.esc="transactiondialog=false"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <transactionpopup @selectTransactionRef="pickTransactionRef($event)" @closeTransactionPopup="transactiondialog=false"></transactionpopup>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>
<script>
import autocomp from '../AutoCompleteComponents/Autocomp';
import simpleautocompwrapper from '../FormComponents/SimpleAutoCompleteWrapper';
import formlistcomponent from '../FormComponents/FormListComponent';
import chips from '../FormComponents/Chips';
import datecomponent from '../FormComponents/DateComponent';
import transactionpopup from '../Forms/transaction_popup';
/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocomp,
    simpleautocompwrapper,
    formlistcomponent,
    datecomponent,
    chips,
    transactionpopup,
  },
  props: [
    'value',
  ],
  data() {
    return {
      entry: {},
      title: '',
      description: '',
      comment: '',
      public: false,
      url: '',
      transactiondialog: false,
      autcompdisplayprops: {
        dimensions: [
          { path: 'dimensions.amount', populate: false },
          { path: 'dimensions.unit', select: 'name', populate: true },
          { path: 'dimensions.aspect', select: 'name', populate: true },
        ],
        classification: [
          { path: 'classification.descriptor', populate: true },
          { path: 'classification.note', populate: false },
        ],
        transscription: [
          { path: 'transscription' },
        ],
      },
    };
  },
  watch: {
    value(val) {
      this.entry = val;
      this.initVals();
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', this.entry);
    },
    parseDate(datestring) {
      return new Date(datestring);
    },
    initVals() {
      if (!this.entry.creator) {
        this.$set(this.entry, 'creator', []);
      }
      if (!this.entry.classification) {
        this.$set(this.entry, 'classification', []);
      }
      if (!this.entry.comments) {
        this.$set(this.entry, 'comments', []);
      }
      if (!this.entry.dimensions) {
        this.$set(this.entry, 'dimensions', []);
      }
      if (!this.entry.transaction) {
        this.$set(this.entry, 'transaction', []);
      }
    },
    pickTransactionRef(e) {
      this.entry.transaction.push({ ref: e });
      this.transactiondialog = false;
    },
    editTransaction(a) {

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
