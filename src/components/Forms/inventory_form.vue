<template>
  <div class="">
    <!-- inventory identifiers -->
    <v-layout
      justify-end
      row
      fill-height
    >
      <chips :items="inventory.identifier" />
    </v-layout>
    <!-- inventory name -->
    <v-layout
      justify-start
      row
      fill-height
    >
      <v-flex xs10>
        <v-text-field
          v-model="inventory.name"
          filled
          class="nameinput"
          label="Name"
        />
      </v-flex>
    </v-layout>
    <!-- inventory partOf -->
    <!-- inventory place -->
    <v-layout
      justify-start
      row
      fill-height
    >
      <v-flex xs6>
        <simpleautocompwrapper
          v-model="inventory.partOf"
          entity="Collect"
          label="Part Of Collection"
        />
      </v-flex>
      <v-flex xs6>
        <simpleautocompwrapper
          v-model="inventory.place"
          entity="Descriptor"
          filter="GEOKEYW"
          label="Place"
        />
      </v-flex>
    </v-layout>
    <!-- inventory creators -->
    <v-layout
      justify-end
      row
      fill-height
    >
      <v-flex xs12>
        <formlistcomponent
          :items.sync="inventory.creator"
          :itemprops="$store.state.api.schemas.inventory.properties.creator.items.properties"
          :listitemstyletypes="creatoritemstyletypes"
          label="Creator"
          nodatamessage="No creators added"
          :simpleformavail="true"
        >
          <template
            slot="form"
            slot-scope="props"
          >
            <v-flex xs6>
              <autocomp
                v-model="props.newitem.role"
                entity="Descriptor"
                filter="ROLE"
                label="Role"
                :multiple="false"
              />
            </v-flex>
            <v-flex xs6>
              <autocomp
                v-model="props.newitem.id"
                entity="Actor"
                label="Creator"
                :multiple="false"
                :displayitemprops="autcompdisplayprops"
              />
            </v-flex>
            <v-flex xs12>
              <v-textarea
                v-model="props.newitem.note"
                filled
                height="70"
                label="Note"
              />
            </v-flex>
          </template>
          <template
            slot="simpleform"
            slot-scope="simpleprops"
          >
            <v-flex xs6>
              <autocomp
                entity="Actor"
                label="Sammler"
                :displayitemprops="autcompdisplayprops"
                :multiple="false"
                @input="simpleprops.newitems[0] = {id: $event, role: {name: 'Sammler', _id: '5cd2922a1cbd4a00139b6e14'}, note: 'entered via quickform'}"
              />
            </v-flex>
            <v-flex xs6>
              <autocomp
                entity="Actor"
                label="Aktueller Eigentümer"
                :displayitemprops="autcompdisplayprops"
                :multiple="false"
                @input="simpleprops.newitems[1] = {id: $event, role: {name: 'Aktueller Eigentümer', _id: '5d1201568997750013ca6740'}, note: 'entered via quickform'}"
              />
            </v-flex>
            <v-flex xs6>
              <autocomp
                entity="Actor"
                label="Verfasser"
                :displayitemprops="autcompdisplayprops"
                :multiple="false"
                @input="simpleprops.newitems[2] = {id: $event, role: {name: 'Verfasser', _id: '5c90a0119ca403074db617f5'}, note: 'entered via quickform'}"
              />
            </v-flex>
            <v-flex xs6>
              <autocomp
                entity="Actor"
                label="Verleger"
                :displayitemprops="autcompdisplayprops"
                :multiple="false"
                @input="simpleprops.newitems[3] = {id: $event, role: {name: 'Verleger', _id: '5c90a0119ca403074db617f0'}, note: 'entered via quickform'}"
              />
            </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- inventory begin of existence -->
    <!-- inventory end of existence -->
    <v-layout
      justify-start
      row
      fill-height
    >
      <v-flex xs6>
        <datecomponent
          :date.sync="inventory.beginOfExistence"
          label="Begin of Existence"
        />
      </v-flex>
      <v-flex xs6>
        <datecomponent
          :date.sync="inventory.endOfExistence"
          label="End of Existence"
        />
      </v-flex>
    </v-layout>
    <!-- inventory documents -->
    <v-layout
      justify-end
      row
      fill-height
    >
      <v-flex xs12>
        <v-list two-line>
          <template v-for="(item, index) in inventory.documents">
            <v-list-item
              :key="item._id"
              :href="`${$store.state.api.url}/assetref/full/${item.ref.name.split('.')[0]}.pdf`"
              target="_blank"
            >
              <v-list-item-avatar>
                <img :src="`${$store.state.api.url}/assetref/thumb/${item.ref.name.split('.')[0]}.jpg`">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="item.ref.name" />
                <v-list-item-subtitle v-html="item.ref.path" />
              </v-list-item-content>
              <v-btn
                fab
                dark
                small
                color="error"
                @click="removeimage(index)"
              >
                <v-icon dark>
                  delete
                </v-icon>
              </v-btn>
            </v-list-item>
          </template>
        </v-list>
        <v-text-field
          v-model="imageName"
          label="Select PDF Document"
          filled
          prepend-icon="attach_file"
          @click="pickFile"
        />
        <input
          ref="image"
          type="file"
          style="display: none"
          accept="application/pdf"
          @change="onFilePicked"
        >
      </v-flex>
    </v-layout>
    <!-- inventory transcription -->
    <v-layout
      justify-start
      row
      fill-height
    >
      <v-flex xs12>
        <v-textarea
          v-model="inventory.transcription"
          height="200"
          label="Transcription"
        />
      </v-flex>
    </v-layout>
    <!-- inventory classifications -->
    <v-layout
      justify-start
      row
      fill-height
    >
      <v-flex xs12>
        <formlistcomponent
          :items.sync="inventory.classification"
          :itemprops="$store.state.api.schemas.inventory.properties.classification.items.properties"
          :listitemstyletypes="classificationitemstyletypes"
          label="Classification"
          nodatamessage="No classifications added"
          :simpleformavail="true"
        >
          <template
            slot="form"
            slot-scope="props"
          >
            <v-layout
              justify-end
              row
              fill-height
              wrap
            >
              <v-flex xs6>
                <autocomp
                  v-model="props.newitem.aspect"
                  entity="Descriptor"
                  filter="KEYWORD"
                  label="Aspect"
                  :multiple="false"
                />
              </v-flex>
              <v-flex xs6>
                <autocomp
                  v-model="props.newitem.descriptor"
                  entity="Descriptor"
                  label="Descriptor"
                  :multiple="false"
                />
              </v-flex>
              <v-flex xs12>
                <v-textarea
                  v-model="props.newitem.note"
                  height="200"
                  filled
                  label="Note"
                />
              </v-flex>
            </v-layout>
          </template>
          <template
            slot="simpleform"
            slot-scope="simpleprops"
          >
            <v-flex xs6>
              <autocomp
                entity="Descriptor"
                filter="KEYWORD"
                label="Quelle"
                :multiple="false"
                @input="simpleprops.newitems[0] = {descriptor: $event, aspect: {name: 'Quelle', _id: '5d1204ac8997750013ca6743'}, note: 'entered via quickform'}"
              />
            </v-flex>
            <v-flex xs6>
              <autocomp
                entity="Descriptor"
                label="Sprache"
                :multiple="false"
                @input="simpleprops.newitems[1] = {descriptor: $event, aspect: {name: 'Sprache', _id: '5d1205ce8997750013ca6744'}, note: 'entered via quickform'}"
              />
            </v-flex>
            <v-flex xs6>
              <autocomp
                entity="Descriptor"
                filter="GEOKEYW"
                label="Auktionsort"
                :multiple="false"
                @input="simpleprops.newitems[2] = {descriptor: $event, aspect: {name: 'Auktionsort', _id: '5d1208228997750013ca6748'}, note: 'entered via quickform'}"
              />
            </v-flex>
            <v-flex xs6>
              <autocomp
                entity="Descriptor"
                label="Inhalt"
                :multiple="false"
                @input="simpleprops.newitems[3] = {descriptor: $event, aspect: {name: 'Inhalt', _id: '5d120a9c8997750013ca674a'}, note: 'entered via quickform'}"
              />
            </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- inventory identifiers -->
    <v-layout
      justify-start
      row
      fill-height
    >
      <v-flex xs12>
        <formlistcomponent
          v-if="inventory.identifier"
          :items.sync="inventory.identifier"
          :listitemstyletypes="['title']"
          label="Identifier"
          nodatamessage="No identifiers added"
        >
          <template
            slot="form"
            slot-scope="props"
          >
            <v-flex xs12>
              <v-textarea
                v-model="props.newitem.textval"
                height="50"
                width="100%"
                label="New Identifier"
              />
            </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- inventory comments -->
    <v-layout
      justify-start
      row
      fill-height
    >
      <v-flex xs12>
        <formlistcomponent
          v-if="inventory.comments"
          :items.sync="inventory.comments"
          :listitemstyletypes="['title']"
          label="Comments"
          nodatamessage="No comments added"
        >
          <template
            slot="form"
            slot-scope="props"
          >
            <v-flex xs5>
              <v-textarea
                v-model="props.newitem.textval"
                height="200"
                label="New Comment"
              />
            </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import autocomp from '../AutoCompleteComponents/Autocomp';
import datecomponent from '../FormComponents/DateComponent';
import formlistcomponent from '../FormComponents/FormListComponent';
import simpleautocompwrapper from '../FormComponents/SimpleAutoCompleteWrapper';
import chips from '../FormComponents/Chips';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocomp,
    formlistcomponent,
    datecomponent,
    chips,
    simpleautocompwrapper,
  },
  props: {
    value: {
      type: Object,
      default: null,
    },
  },
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
        this.inventory = val;
        this.initVals();
      },
    },
    inventory: {
      deep: true,
      immediate: true,
      handler() {
        this.returnObject();
      },
    },
  },
  mounted() {
    this.initVals();
    this.returnObject();
  },
  methods: {
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
          this.imageFile = files[0];
          this.$store.state.api.apiclient.apis.assetref.AssetsController_uploadFile(
              null,
              {
                requestBody: {
                  name: this.imageName,
                  identifier: "identifier",
                  source: "source",
                  file: this.imageFile,
                },
              },
          ).then((res) => {
            if (!this.inventory.documents) this.inventory.documents = [];
            this.inventory.documents.push({ ref: res.body });
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
    initVals() {
      if (this.value) this.inventory = Object.assign(this.value, this.inventory);
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
