<template>
  <div class="">
    <!-- entry identifiers -->
    <v-layout justify-end row fill-height>
      <chips :items="entry.identifier"/>
    </v-layout>
    <!-- entry name -->
    <v-layout justify-start row fill-height>
      <v-flex xs10>
        <v-text-field v-model="entry.name" filled label="Name" class="nameinput" />
      </v-flex>
    </v-layout>
    <!-- entry partOf -->
    <!-- entry original title -->
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <v-text-field v-model="entry.originalTitle" filled label="Original Title" />
      </v-flex>
      <v-flex xs6>
        <simpleautocompwrapper entity="inventory" filled v-model="entry.partOf" label="Part Of Inventory"/>
      </v-flex>
    </v-layout>
    <!-- entry creators -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <formlistcomponent
          :items.sync="entry.creator"
          :itemprops="$store.state.api.schemas.entry.properties.creator.items.properties"
          label="Creator"
          nodatamessage="No creators added"
          :simpleformavail="true">
          <template slot="form" slot-scope="props">
            <v-flex xs6>
              <autocomp entity="Actor" v-model="props.newitem.id" label="Creator" :multiple="false"/>
            </v-flex>
            <v-flex xs6>
              <autocomp entity="Descriptor" filter="ROLE" v-model="props.newitem.role" label="Role" :multiple="false"/>
            </v-flex>
            <v-flex xs12>
              <v-textarea  filled height="70" v-model="props.newitem.note" label="Note" />
            </v-flex>
          </template>
          <template slot="simpleform" slot-scope="simpleprops">
            <v-flex xs6>
              <autocomp
                entity="Actor"
                label="Künstler"
                :multiple="false"
                @input="simpleprops.newitems[0] = {id: $event, role: {name: 'Künstler', _id: '5c90a0119ca403074db617e5'}, note: 'entered via quickform'}" />
            </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- entry transscription -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <v-textarea v-model="entry.transscription" label="Transscription"  filled/>
      </v-flex>
    </v-layout>
     <!-- entry material -->
    <!-- entry technique -->
     <v-layout justify-start row fill-height>
       <v-flex xs6>
         <autocomp entity="Descriptor" filter="MATER" v-model="entry.material" label="Material" :multiple="true" />
      </v-flex>
     <v-flex xs6>
       <autocomp entity="Descriptor" filter="TECHN" v-model="entry.technique" label="Technique" :multiple="true" />
     </v-flex>
    </v-layout>
    <!-- entry dimensions -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <formlistcomponent
          :items.sync="entry.dimensions"
          :itemprops="$store.state.api.schemas.entry.properties.dimensions.items.properties"
          label="Dimensions"
          nodatamessage="No dimensions added"
          :simpleformavail="true">
          <template slot="form" slot-scope="props">
            <v-flex xs4>
              <v-text-field filled v-model.number="props.newitem.amount" label="Amount"/>
            </v-flex>
            <v-flex xs4>
              <autocomp entity="Descriptor" filter="UNIT" v-model="props.newitem.unit" label="Unit" :multiple="false"/>
            </v-flex>
            <v-flex xs4>
              <autocomp entity="Descriptor" filter="DIM" v-model="props.newitem.aspect" label="Aspect" :multiple="false"/>
            </v-flex>
          </template>
          <template slot="simpleform" slot-scope="simpleprops">
            <v-flex xs6>
              <v-text-field
                filled
                label="Height in cm"
                @input="simpleprops.newitems[0] = {amount: parseFloat($event), aspect: {name: 'Höhe', _id: '5c90a0119ca403074db61853'}, unit: {name: 'cm', _id: '5c90a0119ca403074db61857'}}"/>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                filled
                label="Width in cm"
                @input="simpleprops.newitems[1] = {amount: parseFloat($event), aspect: {name: 'Breite', _id: '5c90a0119ca403074db61856'}, unit: {name: 'cm',_id: '5c90a0119ca403074db61857'}}"/>
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
        <formlistcomponent  :items.sync="entry.relations" :itemprops="$store.state.api.schemas.entry.properties.relations.items.properties" label="Related Entries" nodatamessage="No relations added">
          <template slot="form" slot-scope="props">
            <v-flex xs2>
              <v-select filled :items="$store.state.api.schemas.entry.properties.relations.items.properties.kind.enum" label="Relation Type" v-model='props.newitem.kind'/>
            </v-flex>
            <v-flex x12>
              <autocomp entity="Entry" v-model="props.newitem.target"  label="Entry" :multiple="false" :displayitemprops="autcompdisplayprops"/>
            </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- entry identified object -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <simpleautocompwrapper entity="Object" v-model="entry.identification" label="Identified Object" :displayitemprops="autcompdisplayprops"/>
      </v-flex>
    </v-layout>
    <!-- entry images -->
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <v-list two-line>
          <template v-for="(item, index) in entry.images">
            <v-list-item :key="item._id" :href="`${$store.state.api.url}/${item.reference.path}`" target="_blank">
              <v-list-item-avatar>
                <img :src="`${$store.state.api.url}/asset/uploads/thumbs/${item.reference.name.split('.')[0]}_thumb.jpg`">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="item.reference.name"></v-list-item-title>
                <v-list-item-subtitle v-html="item.reference.path"></v-list-item-subtitle>
              </v-list-item-content>
              <v-btn fab dark small color="error" @click="removeimage(index)">
                <v-icon dark>delete</v-icon>
              </v-btn>
            </v-list-item>
          </template>
        </v-list>
        <v-text-field label="Select Image" filled @click='pickFile' v-model='imageName' prepend-icon='attach_file'/>
        <input type="file" style="display: none" ref="image" accept="image/jpeg" @change="onFilePicked">
      </v-flex>
    </v-layout>
    <!-- entry Acquisition -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <div class="formlist pa-3">
          <v-layout justify-space-between align-center row>
            <v-flex xs1>
              <v-label>Acquisition</v-label>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs6>
              <autocomp entity="Descriptor" v-model="entry.acquisition_type" label="Type" :multiple="false"/>
            </v-flex>
            <v-flex xs6>
              <v-btn color="warning" @click="$refs.transactionpopup.openPopup('acquisition')" ><v-icon dark>add</v-icon> Add or link</v-btn>
              <v-btn color="error" class="ml-1" @click="entry.acquisition_ref = null" :disabled="!entry.acquisition_ref"><v-icon dark>link_off</v-icon> Unlink</v-btn>
              <v-btn color="warning" class="ml-1" @click="$refs.editdialog.getItem('transaction', entry.acquisition_ref._id)" :disabled="!entry.acquisition_ref" ><v-icon dark>edit</v-icon> Edit</v-btn>
            </v-flex>
            <v-flex xs12>
              <transactiondetails v-if="entry.acquisition_ref" :id="entry.acquisition_ref" :expanded="false" ref="acqdetails"/>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
    </v-layout>
    <!-- entry Destitution -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <div class="formlist pa-3">
          <v-layout justify-space-between align-center row>
            <v-flex xs1>
              <v-label>Destitution</v-label>
            </v-flex>
          </v-layout>
          <v-layout justify-start row fill-height wrap>
            <v-flex xs6>
              <autocomp entity="Descriptor" v-model="entry.destitution_type" label="Type" :multiple="false"/>
            </v-flex>
            <v-flex xs6>
              <v-btn color="warning" @click="$refs.transactionpopup.openPopup('destitution')" ><v-icon dark>add</v-icon> Add or link</v-btn>
              <v-btn color="error" class="ml-1" @click="entry.destitution_ref = null" :disabled="!entry.destitution_ref"><v-icon dark>link_off</v-icon> Unlink</v-btn>
              <v-btn color="warning" class="ml-1" @click="$refs.editdialog.getItem('transaction', entry.destitution_ref._id)" :disabled="!entry.destitution_ref" ><v-icon dark>edit</v-icon> Edit</v-btn>
            </v-flex>
            <v-flex xs12>
              <transactiondetails v-if="entry.destitution_ref" :id="entry.destitution_ref" :expanded="false" ref="destdetails"/>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
    </v-layout>
     <!-- entry classifications -->
    <v-layout justify-start row fill-height>
      <v-flex xs12 class="mt-3">
        <formlistcomponent
          :items.sync="entry.classification"
          :itemprops="$store.state.api.schemas.entry.properties.classification.items.properties"
          label="Classification"
          nodatamessage="No classifications added"
          :simpleformavail="true">
          <template slot="form" slot-scope="props">
            <v-flex xs6>
              <autocomp entity="Descriptor" filter="KEYWORD" v-model="props.newitem.aspect" label="Aspect" :multiple="false"/>
            </v-flex>
            <v-flex xs6>
              <autocomp entity="Descriptor" v-model="props.newitem.descriptor" label="Descriptor" :multiple="false"/>
            </v-flex>
            <v-flex xs12>
              <v-textarea filled v-model="props.newitem.note" label="Note" />
            </v-flex>
          </template>
          <template slot="simpleform" slot-scope="simpleprops">
            <v-flex xs6>
              <autocomp
                entity="Descriptor"
                label="Kunstgattung"
                :multiple="false"
                @input="simpleprops.newitems[0] = {descriptor: $event, aspect: {name: 'Kunstgattung', _id: '5d5a5af4166362001326d66d'}, note: 'entered via quickform'}"
              />
            </v-flex>
            <v-flex xs6>
              <autocomp
                entity="Descriptor"
                label="Thema"
                :multiple="false"
                @input="simpleprops.newitems[1] = {descriptor: $event, aspect: {name: 'Thema', _id: '5d5a5c0e166362001326d670'}, note: 'entered via quickform'}"
              />
            </v-flex>
            <v-flex xs6>
              <autocomp
                entity="Descriptor"
                label="Datierung"
                :multiple="false"
                @input="simpleprops.newitems[2] = {descriptor: $event, aspect: {name: 'Datierung', _id: '5c90a0119ca403074db619f5'}, note: 'entered via quickform'}"
              />
            </v-flex>
            <v-flex xs6>
              <autocomp
                entity="Descriptor"
                label="Schule"
                :multiple="false"
                @input="simpleprops.newitems[3] = {descriptor: $event, aspect: {name: 'Schule', _id: '5d5a5c7f166362001326d673'}, note: 'entered via quickform'}"
              />
            </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
     <!-- entry comments -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <formlistcomponent v-if="entry.comments" :items.sync="entry.comments" label="Comments" nodatamessage="No comments added">
          <template slot="form" slot-scope="props">
          <v-flex xs12>
              <v-textarea v-model="props.newitem.textval" filled label="New Comment"/>
          </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- transaction selection popup -->
    <transactionpopup @selectTransactionRef="pickTransactionRef($event)" ref="transactionpopup"/>
    <editdialog :title="`Edit Transaction`" ref="editdialog" @close="refreshdetails" />
  </div>
</template>
<script>
import axios from 'axios';
import autocomp from '../AutoCompleteComponents/Autocomp';
import simpleautocompwrapper from '../FormComponents/SimpleAutoCompleteWrapper';
import formlistcomponent from '../FormComponents/FormListComponent';
import chips from '../FormComponents/Chips';
import datecomponent from '../FormComponents/DateComponent';
import transactiondetails from '../DetailViews/transaction_details';
import transactionpopup from '../Forms/transaction_popup';
import editdialog from '../editDialog';
/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocomp,
    simpleautocompwrapper,
    formlistcomponent,
    datecomponent,
    chips,
    transactionpopup,
    transactiondetails,
    editdialog,
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
      imageName: '',
      imageUrl: '',
      imageFile: '',
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
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.entry = val;
        this.initVals();
      },
    },
    entry: {
      deep: true,
      immediate: true,
      handler() {
        this.returnObject();
      },
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', this.entry);
    },
    parseDate(datestring) {
      return new Date(datestring);
    },
    pickFile() {
      this.$refs.image.click();
    },
    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        const fr = new FileReader();
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf('.') <= 0) {
          return;
        }
        fr.readAsDataURL(files[0]);
        fr.addEventListener('load', () => {
          const formData = new FormData();
          this.imageUrl = fr.result;
          this.imageFile = files[0];
          formData.append('file', this.imageFile);
          axios.post(`${this.$store.state.api.url}/api/v1/upload/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }).then((res) => {
            if (!this.entry.images) this.entry.images = [];
            this.entry.images.push({ reference: res.data });
            this.returnObject();
            this.imageName = '';
            this.imageFile = '';
            this.imageUrl = '';
          });
        });
      } else {
        this.imageName = '';
        this.imageFile = '';
        this.imageUrl = '';
      }
    },
    removeimage(index) {
      this.entry.images.splice(index, 1);
      this.returnObject();
    },
    initVals() {
      if (this.value) this.entry = Object.assign(this.value, this.entry);
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
      this.$set(this.entry, `${e.target}_ref`, e.ref);
      this.returnObject();
    },
    refreshdetails() {
      this.$refs.acqdetails.refresh();
      this.$refs.destdetails.refresh();
    }
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
