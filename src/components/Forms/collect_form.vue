<template>
  <div class="">
    <!-- collection identifiers -->
    <v-layout justify-end row fill-height>
        <chips :items="collection.identifier"/>
    </v-layout>
    <!-- collection name -->
    <v-layout justify-start row fill-height>
      <v-flex xs10>
        <v-text-field v-model="collection.name" label="Name" filled class="nameinput" />
      </v-flex>
    </v-layout>
    <!-- collection creators -->
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <formlistcomponent
          :items.sync="collection.creator"
          :itemprops="$store.state.api.schemas.collect.properties.creator.items.properties"
          label="Creator"
          nodatamessage="No creators added"
        >
          <template slot="form" slot-scope="props">
            <v-layout justify-end row fill-height wrap>
              <v-flex xs6>
                <autocomp entity="Descriptor" filter="ROLE" v-model="props.newitem.role" label="Role" :multiple="false"/>
              </v-flex>
              <v-flex xs6>
                <autocomp entity="Actor" v-model="props.newitem.id" label="Collector" :multiple="false" :displayitemprops="autcompdisplayprops" />
              </v-flex>
              <v-flex xs12>
                <v-textarea height="200" v-model="props.newitem.note" filled label="Note" />
              </v-flex>
            </v-layout>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- collection places, times -->
    <v-layout justify-end row fill-height>
      <v-flex xs6>
        <autocomp entity="Descriptor" filter="GEOKEYW" v-model="collection.place" label="Place" :multiple="true" />
      </v-flex>
      <v-flex xs6>
        <autocomp entity="Descriptor" filter="PERIOD" v-model="collection.time" label="Time" :multiple="true" />
      </v-flex>
    </v-layout>
    <!-- collection description -->
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <v-textarea height="200" v-model="collection.description" filled label="Description" />
      </v-flex>
    </v-layout>
    <!-- collection documents -->
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <v-list two-line>
          <template v-for="(item, index) in collection.documents">
            <v-list-item :key="item._id" :href="`${$store.state.api.url}/${item.ref.path}`" target="_blank">
              <v-list-item-avatar>
                <img :src="`${$store.state.api.url}/assets/thumb/${item.ref.name.split('.')[0]}_thumb.jpg`">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="item.ref.name"/>
                <v-list-item-subtitle v-html="item.ref.path"/>
              </v-list-item-content>
              <v-btn fab dark small color="error" @click="removeimage(index)">
                <v-icon dark>delete</v-icon>
              </v-btn>
            </v-list-item>
          </template>
        </v-list>
        <v-text-field label="Select PDF Document" filled @click='pickFile' v-model='imageName' prepend-icon='attach_file'/>
        <input type="file" style="display: none" ref="image" accept="application/pdf" @change="onFilePicked">
      </v-flex>
    </v-layout>
    <!-- collection classifications -->
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <formlistcomponent
          :items.sync="collection.classification"
          :itemprops="$store.state.api.schemas.collect.properties.classification.items.properties"
          label="Classification"
          nodatamessage="No classifications added">
          <template slot="form" slot-scope="props">
          <v-layout justify-end row fill-height wrap>
            <v-flex xs6>
                <autocomp entity="Descriptor" filter="KEYWORD" v-model="props.newitem.aspect" label="Aspect" :multiple="false"/>
            </v-flex>
            <v-flex xs6>
              <autocomp entity="Descriptor" v-model="props.newitem.descriptor" label="Descriptor" :multiple="false"/>
            </v-flex>
            <v-flex xs12>
              <v-textarea height="200" filled v-model="props.newitem.note" label="Note" />
            </v-flex>
          </v-layout>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- collection beginn/end of existence -->
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <datecomponent v-bind:date.sync="collection.beginOfExistence" label="Begin of Existence"/>
      </v-flex>
      <v-flex xs6>
        <datecomponent v-bind:date.sync="collection.endOfExistence" label="End of Existence"/>
      </v-flex>
    </v-layout>
    <!-- collection destitution -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <v-textarea height="200" filled v-model="collection.destitution" label="Destitution" />
      </v-flex>
    </v-layout>
    <!-- collection references zotero -->
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <formlistcomponent
          :items.sync="collection.references"
          :itemprops="$store.state.api.schemas.collect.properties.references.items.properties"
          label="Bibliograpic References"
          nodatamessage="No Bibliograpic References added"
        >
          <template slot="form" slot-scope="props">
            <v-layout justify-end row fill-height wrap>
              <v-flex xs6>
                  <v-text-field filled label="Zotero Reference URI" @click='zoterodialog=true' v-model='props.newitem.ref' prepend-icon='attach_file'/>
              </v-flex>
              <v-flex xs6>
                  <v-text-field filled v-model="props.newitem.pageno" label="Page Number/Range" type="number"/>
              </v-flex>
              <v-flex xs12>
                <v-textarea height="200" filled v-model="props.newitem.note" label="Note" />
              </v-flex>
            </v-layout>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- collection comments -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <formlistcomponent
          :items.sync="collection.comments"
          label="Comments"
          nodatamessage="No comments added">
          <template slot="form" slot-scope="props">
          <v-flex xs12>
              <v-textarea height="200" filled v-model="props.newitem.textval" label="New Comment"/>
          </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- zotero ref selection popup -->
    <v-layout column justify-space-between>
      <v-dialog
        v-model="zoterodialog"
        @keydown.esc="zoterodialog=false"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click.native="zoterodialog=false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Select Zotero Reference</v-toolbar-title>
            <v-spacer/>
            <v-toolbar-items>
            </v-toolbar-items>
            <v-menu bottom right offset-y>
              <v-btn dark icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
            </v-menu>
          </v-toolbar>
          <v-container grid-list-md text-xs-center>
            <zoterolist @selectref="pickZoteroRef($event)"/>
          </v-container>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>
<script>
import axios from 'axios';
import autocomp from '../AutoCompleteComponents/Autocomp';
import formlistcomponent from '../FormComponents/FormListComponent';
import chips from '../FormComponents/Chips';
import datecomponent from '../FormComponents/DateComponent';
import zoterolist from '../ListViews/zotero_list';
import HELPERS from '../../helpers';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  mixins: [HELPERS],
  components: {
    autocomp,
    formlistcomponent,
    datecomponent,
    chips,
    zoterolist,
  },
  props: [
    'value',
  ],
  data() {
    return {
      zoterodialog: false,
      collection: {},
      title: '',
      description: '',
      comment: '',
      public: false,
      url: '',
      imageName: '',
      imageUrl: '',
      imageFile: '',
      beginofexistencemenu: false,
      endofexistencemenu: false,
      newcomment: '',
      autcompdisplayprops: {
        dimensions: [
          { path: 'beginOfExistence', populate: false },
          { path: 'endOfExistence', populate: false },
        ],
      },
    };
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.collection = val;
        this.initVals();
      },
    },
    collection: {
      deep: true,
      immediate: true,
      handler() {
        this.returnObject();
      },
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', this.collection);
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
            if (!this.collection.documents) this.collection.documents = [];
            this.collection.documents.push({ ref: res.body });
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
      this.collection.documents.splice(index, 1);
      this.returnObject();
    },
    pickZoteroRef(ref) {
      if (!this.collection.references) this.collection.references = [];
      this.collection.references.push({ ref: ref.links.self.href, name: ref.data.title });
      this.zoterodialog = false;
    },
    initVals() {
      if (this.value) this.collection = Object.assign(this.value, this.collection);
      if (!this.collection.classification) {
        this.$set(this.collection, 'classification', []);
      }
      if (!this.collection.creator) {
        this.$set(this.collection, 'creator', []);
      }
      if (!this.collection.comments) {
        this.$set(this.collection, 'comments', []);
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
