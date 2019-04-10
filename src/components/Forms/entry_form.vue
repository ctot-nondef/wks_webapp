<template>
  <div class="">
    <v-layout justify-end row fill-height>
      <!-- entry identifiers -->
      <chips :items="entry.identifier"/>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs6>
      <!-- entry name -->
        <v-text-field v-model="entry.name" label="Name" @input="returnObject()"></v-text-field>
      </v-flex>
    </v-layout>
    <!-- entry partOf -->
    <v-layout justify-start row fill-height>
      <v-flex xs5>
        <simpleautocompwrapper entity="inventory" v-model="entry.partOf" v-bind:prop.sync="entry.partOf" label="Part Of Inventory"/>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <!-- entry creators -->
        <formlistcomponent :items="entry.creator" :itemprops="$store.state.api.schemas.entry.properties.creator.items.properties" :listitemstyletypes="creatoritemstyletypes" label="Creator" nodatamessage="No creators added">
          <template slot="form" slot-scope="props">
          <v-flex xs5>
              <autocomp entity="Descriptor" filter="ROLE" v-model="props.newitem.role" label="Role" :multiple="false"></autocomp>
          </v-flex>
            <v-flex xs5>
              <autocomp entity="Actor" v-model="props.newitem.id" label="Collector" :multiple="false"></autocomp>
          </v-flex>
          <v-flex xs12>
          <v-textarea  v-model="props.newitem.note" label="Note" /> 
          </v-flex> 
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
     <!-- entry original title -->
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <v-text-field v-model="entry.originaltitle" label="Original Title" @input="returnObject()"></v-text-field>
      </v-flex>
    </v-layout>
    <!-- entry transscription -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <v-textarea v-model="entry.transscription" label="Transscription" @input="returnObject()"></v-textarea>
      </v-flex>
    </v-layout>
     <!-- entry material -->
     <v-layout justify-start row fill-height>
       <v-flex xs6>
         <autocomp entity="descriptor" filter="MATER" v-model="entry.material" label="Material" :multiple="true" @input="returnObject();"></autocomp>
      </v-flex>
    </v-layout>
    <!-- entry technique -->
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <autocomp entity="descriptor" filter="TECHN" v-model="entry.technique" label="Technique" :multiple="true" @input="returnObject();"></autocomp>
      </v-flex>
    </v-layout>
    <!-- entry dimensions -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <formlistcomponent :items="entry.dimensions" :itemprops="$store.state.api.schemas.entry.properties.dimensions.items.properties" :listitemstyletypes="dimensionsitemstyletypes" label="Dimensions" nodatamessage="No dimensions added">
          <template slot="form" slot-scope="props">
            <v-flex xs5>
              <v-text-field  v-model.number="props.newitem.amount" label="Amount"></v-text-field>
          </v-flex>
          <v-flex xs5>
              <autocomp entity="descriptor" filter="DIM" v-model="props.newitem.aspect" label="Aspect" :multiple="false"></autocomp>
          </v-flex>
            <v-flex xs5>
              <autocomp entity="descriptor" filter="UNIT" v-model="props.newitem.unit" label="Descriptor" :multiple="false"></autocomp>
          </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- entry created start -->
    <v-layout justify-start row fill-height>
      <v-flex xs5>
        <datecomponent v-bind:date.sync="entry.created_start" label="Created Start"/>
      </v-flex>
    </v-layout>
    <!-- entry created end -->
    <v-layout justify-start row fill-height>
      <v-flex xs5>
        <datecomponent v-bind:date.sync="entry.created_end" label="Created End"/>
      </v-flex>
    </v-layout>
    <!-- entry related entries -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <formlistcomponent  :items="entry.relations" :itemprops="$store.state.api.schemas.entry.properties.relations.items.properties" :listitemstyletypes="relationitemstyletypes" label="Related Entries" nodatamessage="No relations added">
            <template slot="form" slot-scope="props">
            <v-flex xs2>
              <v-select :items="$store.state.api.schemas.entry.properties.relations.items.properties.kind.enum" label="Relation Type" v-model='props.newitem.kind'></v-select>
            </v-flex>
              <v-flex x12>
            <autocomp entity="entry" v-model="props.newitem.target"  label="Entry" :multiple="false" :displayitemprops="autcompdisplayprops"></autocomp>
            </v-flex>
            </template>
          </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- entry transaction -->
     <v-layout justify-start row fill-height>
       <v-flex xs6>
         <autocomp entity="transaction" v-model="entry.transaction" label="Transaction" :multiple="true" @input="returnObject();"></autocomp>
      </v-flex>
    </v-layout>
     <!-- entry classifications -->
    <v-layout justify-start row fill-height>
      <v-flex xs12 class="mt-3">
        <formlistcomponent v-if="entry.classification" :items="entry.classification" :itemprops="$store.state.api.schemas.entry.properties.classification.items.properties" :listitemstyletypes="classificationitemstyletypes" label="Classification" nodatamessage="No classifications added">
          <template slot="form" slot-scope="props">
          <v-flex xs5>
            <autocomp entity="descriptor" filter="KEYWORD" v-model="props.newitem.aspect" label="Aspect" :multiple="false"></autocomp>
          </v-flex>
          <v-flex xs5>
            <autocomp entity="descriptor" v-model="props.newitem.descriptor" label="Descriptor" :multiple="false"></autocomp>
          </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- entry images -->
    <!-- entry references zotero?-->
     <!-- entry comments -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <formlistcomponent v-if="entry.comments" :items="entry.comments" :listitemstyletypes="['title']" label="Comments" nodatamessage="No comments added">
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
      entry: {},
      title: '',
      description: '',
      comment: '',
      public: false,
      url: '',
      creatoritemstyletypes: [
        'title',
        'subtitle',
        'subtitle',
      ],
      dimensionsitemstyletypes: [
        'title',
        'subtitle',
        'subtitle',
      ],
      classificationitemstyletypes: [
        'title',
        'subtitle',
      ],
      relationitemstyletypes: [
        'title',
        'subtitle',
        'subtitle',
      ],
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
      beginofexistencemenu: false,
      endofexistencemenu: false,
    };
  },
  watch: {
    value(val) {
      this.entry = val;
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
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', this.entry);
    },
    parseDate(datestring) {
      return new Date(datestring);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
