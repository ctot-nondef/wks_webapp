<template>
  <div class="">
    <!-- object identifiers -->
    <v-layout justify-end row fill-height>
      <chips :items="object.identifier"/>
    </v-layout>
    <!-- object name -->
    <v-layout justify-start row fill-height>
      <v-flex xs10>
        <v-text-field v-model="object.name" filled label="Name" class="nameinput" />
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs6>
          <!-- object currenOwner -->
        <autocomp entity="Actor" v-model="object.currentOwner" :parententity="object._id" label="Current Owners" :multiple="true"/>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <!-- object creators -->
        <formlistcomponent :items.sync="object.creator" :itemprops="$store.state.api.schemas.object.properties.creator.items.properties" :listitemstyletypes="creatoritemstyletypes" label="Creator" nodatamessage="No creators added">
          <template slot="form" slot-scope="props">
          <v-flex xs5>
              <autocomp entity="Descriptor" filter="ROLE" v-model="props.newitem.role" label="Role" :multiple="false"/>
          </v-flex>
            <v-flex xs5>
              <autocomp entity="Actor" v-model="props.newitem.id" label="Collector" :multiple="false"/>
          </v-flex>
          <v-flex xs12>
          <v-textarea  v-model="props.newitem.note" label="Note" />
          </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs5>
        <!-- object created start -->
        <datecomponent v-bind:date.sync="object.created_start" label="Created Start"/>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs5>
        <!-- object created end -->
        <datecomponent v-bind:date.sync="object.created_end" label="Created End"/>
      </v-flex>
    </v-layout>
    <!-- object original title -->
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <v-text-field v-model="object.originalTitle" label="Original Title" @input="returnObject()"/>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <!-- object material -->
        <autocomp entity="Descriptor" filter="MATER" v-model="object.material" label="Material" :multiple="true" />
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs6>
      <!-- object technique -->
        <autocomp entity="Descriptor" filter="TECHN" v-model="object.technique" label="Technique" :multiple="true" />
      </v-flex>
    </v-layout>
    <!-- object dimensions -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <formlistcomponent
          :items.sync="object.dimensions"
          :itemprops="$store.state.api.schemas.object.properties.dimensions.items.properties"
          :listitemstyletypes="dimensionsitemstyletypes"
          label="Dimensions"
          nodatamessage="No dimensions added"
          :simpleformavail="true">
          <template slot="form" slot-scope="props">
            <v-flex xs5>
              <v-text-field  v-model.number="props.newitem.amount" label="Amount"/>
            </v-flex>
            <v-flex xs5>
                <autocomp entity="Descriptor" filter="DIM" v-model="props.newitem.aspect" label="Aspect" :multiple="false"/>
            </v-flex>
              <v-flex xs5>
                <autocomp entity="Descriptor" filter="UNIT" v-model="props.newitem.unit" label="Descriptor" :multiple="false"/>
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
    <!-- object classifications -->
    <v-layout justify-start row fill-height>
      <v-flex xs12 class="mt-3">

        <formlistcomponent
          v-if="object.classification"
          :items.sync="object.classification"
          :itemprops="$store.state.api.schemas.object.properties.classification.items.properties"
          label="Classification"
          nodatamessage="No classifications added"
          :simpleformavail="true">
          <template slot="form" slot-scope="props">
            <v-layout justify-end row fill-height wrap>
              <v-flex xs6>
                <autocomp entity="Descriptor" filter="KEYWORD" v-model="props.newitem.aspect" label="Aspect" :multiple="false"/>
              </v-flex>
              <v-flex xs6>
                <autocomp entity="Descriptor" v-model="props.newitem.descriptor" label="Descriptor" :multiple="false"/>
              </v-flex>
              <v-flex xs12>
                <v-textarea filled v-model="props.newitem.note" label="Note" />
              </v-flex>
            </v-layout>
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
    <!-- object description -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <v-textarea v-model="object.description" label="Description" />
      </v-flex>
    </v-layout>
    <!-- object images -->
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <v-list two-line>
          <template v-for="(item, index) in object.images">
            <v-list-item :key="item._id" :href="`${$store.state.api.url}/${item.reference.path}`" target="_blank">
              <v-list-item-avatar>
                <img :src="`${$store.state.api.url}/asset/uploads/thumbs/${item.reference.name.split('.')[0]}_thumb.jpg`">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="item.reference.name"/>
                <v-list-item-subtitle v-html="item.reference.path"/>
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
    <!-- object references zotero?-->
    <!-- object comments -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <formlistcomponent v-if="object.comments" :items.sync="object.comments" :listitemstyletypes="['title']" label="Comments" nodatamessage="No comments added">
          <template slot="form" slot-scope="props">
          <v-flex xs5>
              <v-textarea v-model="props.newitem.textval" label="New Comment"/>
          </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import axios from 'axios';
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
      object: {},
      title: '',
      description: '',
      comment: '',
      public: false,
      url: '',
      imageName: '',
      imageUrl: '',
      imageFile: '',
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
      beginofexistencemenu: false,
      endofexistencemenu: false,
    };
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.object = val;
        this.initVals();
      },
    },
    object: {
      deep: true,
      immediate: true,
      handler() {
        this.returnObject();
      },
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', this.object);
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
            if (!this.object.images) this.object.images = [];
            this.object.images.push({ reference: res.data });
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
      this.object.images.splice(index, 1);
      this.returnObject();
    },
    initVals() {
      if (this.value) this.object = Object.assign(this.value, this.object);
      if (!this.object.creator) {
        this.$set(this.object, 'creator', []);
      }
      if (!this.object.classification) {
        this.$set(this.object, 'classification', []);
      }
      if (!this.object.comments) {
        this.$set(this.object, 'comments', []);
      }
      if (!this.object.dimensions) {
        this.$set(this.object, 'dimensions', []);
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
