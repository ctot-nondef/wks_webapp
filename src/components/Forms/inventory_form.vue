<template>
  <div class="">
    <v-layout justify-end row fill-height>
      <!-- inventory identifiers -->
      <chips :items="inventory.identifier"/>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <!-- inventory name -->
        <v-text-field v-model="inventory.name" label="Name" @input="returnObject()"></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <!-- inventory creators -->
        <formlistcomponent :items="inventory.creator" :itemprops="$store.state.api.schemas.inventory.properties.creator.items.properties" :listitemstyletypes="creatoritemstyletypes" label="Creator" nodatamessage="No creators added">
          <template slot="form" slot-scope="props">
          <v-flex xs5>
              <autocomp entity="Descriptor" filter="ROLE" v-model="props.newitem.role" label="Role" :multiple="false"></autocomp>
          </v-flex>
          <v-flex xs5>
            <autocomp entity="Actor" v-model="props.newitem.id" label="Creator" :multiple="false"></autocomp>
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
        <!-- inventory place -->
        <simpleautocompwrapper entity="descriptor" filter="PLACE" v-model="inventory.place" v-bind:prop.sync="inventory.place" label="Place"/>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs5>
        <!-- inventory begin of existence -->
        <datecomponent v-bind:date.sync="inventory.beginOfExistence" label="Begin of Existence"/>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs5>
        <!-- inventory end of existence -->
        <datecomponent v-bind:date.sync="inventory.endOfExistence" label="End of Existence"/>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <!-- inventory images or documents? -->
        <v-list two-line>
          <template v-for="(item, index) in inventory.documents">
            <v-list-tile :key="item._id" avatar  @click="">
              <v-list-tile-avatar>
                <img :src="`https://wksgoose.acdh-dev.oeaw.ac.at/${item.path.split('.')[0]}_thumb.jpg`">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.name"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.path"></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-btn fab dark small color="error" @click="removeimage(index)">
                <v-icon dark>delete</v-icon>
              </v-btn>
            </v-list-tile>
          </template>
        </v-list>
        <v-text-field label="Select Image" @click='pickFile' v-model='imageName' prepend-icon='attach_file'></v-text-field>
        <input type="file" style="display: none"  ref="image"  accept="image/*"  @change="onFilePicked"/>
      </v-flex>
    </v-layout>
    <!-- inventory references zotero? -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <!-- inventory classifications -->
        <formlistcomponent v-if="inventory.classification" :items="inventory.classification" :itemprops="$store.state.api.schemas.inventory.properties.classification.items.properties" :listitemstyletypes="classificationitemstyletypes" label="Classification" nodatamessage="No classifications added">
          <template slot="form" slot-scope="props">
            <v-flex xs5>
              <autocomp entity="Descriptor" filter="KEYWORD"  v-model="props.newitem.aspect" label="Aspect"  :multiple="false"></autocomp>
            </v-flex>
            <v-flex xs5>
              <autocomp entity="Descriptor" v-model="props.newitem.descriptor" label="Descriptor"  :multiple="false"></autocomp>
            </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- inventory partOf -->
    <v-layout justify-start row fill-height>
      <v-flex xs5>
        <simpleautocompwrapper entity="Collect" v-model="inventory.partOf" v-bind:prop.sync="inventory.partOf" label="Part Of Collection"/>
      </v-flex>
     </v-layout>
     <!-- inventory comments -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <formlistcomponent v-if="inventory.comments" :items="inventory.comments" :listitemstyletypes="['title']" label="Comments" nodatamessage="No comments added">
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
import axios from 'axios';
import autocomp from '../AutoCompleteComponents/Autocomp';
import datecomponent from '../FormComponents/DateComponent';
import formlistcomponent from '../FormComponents/FormListComponent';
import formtfreadview from '../FormComponents/FormTextFieldReadView';
import simpleautocompwrapper from '../FormComponents/SimpleAutoCompleteWrapper';
import chips from '../FormComponents/Chips';


/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocomp,
    formlistcomponent,
    datecomponent,
    formtfreadview,
    chips,
    simpleautocompwrapper,
  },
  props: [
    'value',
  ],
  data() {
    return {
      inventory: {},
      title: '',
      description: '',
      comment: '',
      public: false,
      url: '',
      imageName: '',
      imageUrl: '',
      imageFile: '',
      selectedcollection: {},
      creatoritemstyletypes: [
        'title',
        'subtitle',
        'subtitle',
      ],
      classificationitemstyletypes: [
        'title',
        'subtitle',
      ],
      isEditingPlace: false,
      isEditingPartOf: false,
    };
  },
  watch: {
    value(val) {
      this.inventory = val;
      this.selectedcollection = val.partOf || {};
      if (!this.inventory.classification) {
        this.$set(this.inventory, 'classification', []);
      }
      if (!this.inventory.creator) {
        this.$set(this.inventory, 'creator', []);
      }
      if (!this.inventory.comments) {
        this.$set(this.inventory, 'comments', []);
      }
    },
  },
  methods: {
    setEditingToRead(prop) {
      this.$set(this, prop, true);
    },
    returnObject() {
      this.$emit('input', this.inventory);
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
          formData.append('image', this.imageFile);
          axios.post('https://wksgoose.acdh-dev.oeaw.ac.at/api/v1/upload/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }).then((res) => {
            if (!this.inventory.documents) this.inventory.documents = [];
            this.inventory.documents.push(res.data);
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
      this.inventory.documents.splice(index, 1);
      this.returnObject();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
