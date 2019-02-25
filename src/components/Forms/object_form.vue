<template>
  <div class="">
    <v-layout justify-end row fill-height>
      <!-- object identifiers -->
      <chips :items="object.identifier"/>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs6>
      <!-- object name -->
        <v-text-field v-model="object.name" label="Name" @input="returnObject()"></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs6>
          <!-- object currenOwner -->
        <autocompactor v-model="object.currentOwner" :parententity="object._id" label="Current Owners" :multiple="true"></autocompactor>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <!-- object creators -->
        <formlistcomponent :items="object.creator" :itemprops="$store.state.api.schemas.object.properties.creator.items.properties" :listitemstyletypes="creatoritemstyletypes" label="Creator" nodatamessage="No creators added">
          <template slot="form" slot-scope="props">
          <v-flex xs5>
              <autocompdescriptor filter="ROLE" v-model="selecteddescriptor" label="Role" :multiple="false" @input="props.newitem.role=$event;returnObject();"></autocompdescriptor>
          </v-flex>
            <v-flex xs5>
          <autocompactor v-model="selectedactor" label="Collector" :multiple="false" @input="props.newitem.id=$event;returnObject();"></autocompactor>
          </v-flex>
          <v-flex xs12>
          <v-textarea  v-model="props.newitem.note" label="Note" /> 
          </v-flex> 
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <!-- object created start -->
        <datecomponent v-bind:date.sync="object.created_start" label="Created Start"/>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <!-- object created end -->
        <datecomponent v-bind:date.sync="object.created_end" label="Created End"/>
      </v-flex>
    </v-layout>
    <!-- object original title -->
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <v-text-field v-model="object.originaltitle" label="Original Title" @input="returnObject()"></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <!-- object material -->
        <autocompdescriptor filter="MATER" v-model="object.material" label="Material" :multiple="true" @input="returnObject();"></autocompdescriptor>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs6>
      <!-- object technique -->
        <autocompdescriptor filter="TECHN" v-model="object.technique" label="Technique" :multiple="true" @input="returnObject();"></autocompdescriptor>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <!-- object dimensions -->
        <formlistcomponent :items="object.dimensions" :itemprops="$store.state.api.schemas.object.properties.dimensions.items.properties" :listitemstyletypes="dimensionsitemstyletypes" label="Dimensions" nodatamessage="No dimensions added">
          <template slot="form" slot-scope="props">
            <v-flex xs5>
              <v-text-field  v-model.number="props.newitem.amount" label="Amount"></v-text-field>
          </v-flex>
          <v-flex xs5>
              <autocompdescriptor filter="DIM" v-model="selecteddimensionsaspect" label="Aspect" :multiple="false" @input="props.newitem.aspect=$event;returnObject();"></autocompdescriptor>
          </v-flex>
            <v-flex xs5>
              <autocompdescriptor filter="UNIT" v-model="selecteddimensionsdescriptor" label="Descriptor" :multiple="false" @input="props.newitem.unit=$event;returnObject();"></autocompdescriptor>
          </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs12 class="mt-3">
        <!-- object classifications -->
        <formlistcomponent v-if="object.classification" :items="object.classification" :itemprops="$store.state.api.schemas.collect.properties.classification.items.properties" :listitemstyletypes="classificationitemstyletypes" label="Classification" nodatamessage="No classifications added">
          <template slot="form" slot-scope="props">
          <v-flex xs5>
              <autocompdescriptor filter="KEYWORD" v-model="selectedclassificationaspect" label="Aspect" @input="props.newitem.aspect = selectedclassificationaspect;returnObject();" :multiple="false"></autocompdescriptor>
          </v-flex>
          <v-flex xs5>
          <autocompdescriptor v-model="selectedclassificationdescriptor" label="Descriptor" @input="props.newitem.descriptor = selectedclassificationdescriptor;returnObject();" :multiple="false"></autocompdescriptor>
          </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <!-- object description -->
        <v-textarea v-model="object.description" label="Description" @input="returnObject()"></v-textarea>
      </v-flex>
    </v-layout>
    <!-- object images -->
    <!-- object references zotero?-->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <!-- object comments -->
        <formlistcomponent v-if="object.comments" :items="object.comments" :listitemstyletypes="['title']" label="Comments" nodatamessage="No comments added">
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
import autocompactor from '../AutoCompleteComponents/AutocompActor';
import autocompdescriptor from '../AutoCompleteComponents/AutocompDescriptor';
import formlistcomponent from '../FormComponents/FormListComponent';
import chips from '../FormComponents/Chips';
import datecomponent from '../FormComponents/DateComponent';
import HELPERS from "../../helpers";
/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocompactor,
    autocompdescriptor,
    formlistcomponent,
    datecomponent,
    chips,
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
      selecteddescriptor:null,
      selectedactor:null,
      selectedclassificationaspect: null,
      selectedclassificationdescriptor: null,
      selecteddimensionsaspect: null,
      selecteddimensionsdescriptor: null,
      creatoritemstyletypes: [
        'title',
        'subtitle',
        'subtitle'
      ],
      dimensionsitemstyletypes: [
        'title',
        'subtitle',
        'subtitle'
      ],
      classificationitemstyletypes: [
        'title',
        'subtitle'
      ],
      beginofexistencemenu: false,
      endofexistencemenu: false,
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
