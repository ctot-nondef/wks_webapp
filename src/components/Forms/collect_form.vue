<template>
  <div class="">
    <!-- collection identifiers -->
    <v-layout
      justify-end
      row
      fill-height
    >
      <chips :items="collection.identifier" />
    </v-layout>
    <!-- collection name -->
    <v-layout
      justify-start
      row
      fill-height
    >
      <v-flex xs10>
        <v-text-field
          v-model="collection.name"
          label="Name"
          filled
          class="nameinput"
        />
      </v-flex>
    </v-layout>
    <!-- collection creators -->
    <v-layout
      justify-end
      row
      fill-height
    >
      <v-flex xs12>
        <formlistcomponent
          :items.sync="collection.creator"
          :itemprops="$store.state.api.schemas.collect.properties.creator.items.properties"
          label="Creator"
          nodatamessage="No creators added"
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
                  label="Collector"
                  :multiple="false"
                  :displayitemprops="autcompdisplayprops"
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
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- collection places, times -->
    <v-layout
      justify-end
      row
      fill-height
    >
      <v-flex xs6>
        <autocomp
          v-model="collection.place"
          entity="Descriptor"
          filter="GEOKEYW"
          label="Place"
          :multiple="true"
        />
      </v-flex>
      <v-flex xs6>
        <autocomp
          v-model="collection.time"
          entity="Descriptor"
          filter="PERIOD"
          label="Time"
          :multiple="true"
        />
      </v-flex>
    </v-layout>
    <!-- collection description -->
    <v-layout
      justify-end
      row
      fill-height
    >
      <v-flex xs12>
        <v-textarea
          v-model="collection.description"
          height="200"
          filled
          label="Description"
        />
      </v-flex>
    </v-layout>
    <!-- collection documents -->
    <v-layout
      justify-end
      row
      fill-height
    >
      <v-flex xs12>
        <v-list two-line>
          <template v-for="(item, index) in collection.documents">
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
    <!-- collection classifications -->
    <v-layout
      justify-end
      row
      fill-height
    >
      <v-flex xs12>
        <formlistcomponent
          :items.sync="collection.classification"
          :itemprops="$store.state.api.schemas.collect.properties.classification.items.properties"
          label="Classification"
          nodatamessage="No classifications added"
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
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- collection beginn/end of existence -->
    <v-layout
      justify-start
      row
      fill-height
    >
      <v-flex xs6>
        <datecomponent
          :date.sync="collection.beginOfExistence"
          label="Begin of Existence"
        />
      </v-flex>
      <v-flex xs6>
        <datecomponent
          :date.sync="collection.endOfExistence"
          label="End of Existence"
        />
      </v-flex>
    </v-layout>
    <!-- collection destitution -->
    <v-layout
      justify-start
      row
      fill-height
    >
      <v-flex xs12>
        <v-textarea
          v-model="collection.destitution"
          height="200"
          filled
          label="Destitution"
        />
      </v-flex>
    </v-layout>
    <!-- collection references zotero -->
    <v-layout
      justify-end
      row
      fill-height
    >
      <v-flex xs12>
        <formlistcomponent
          :items.sync="collection.references"
          :itemprops="$store.state.api.schemas.collect.properties.references.items.properties"
          label="Bibliograpic References"
          nodatamessage="No Bibliograpic References added"
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
                <v-text-field
                  v-model="props.newitem.ref"
                  filled
                  label="Zotero Reference URI"
                  prepend-icon="attach_file"
                  @click="zoterodialog=true"
                />
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model="props.newitem.pageno"
                  filled
                  label="Page Number/Range"
                  type="number"
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
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- collection comments -->
    <v-layout
      justify-start
      row
      fill-height
    >
      <v-flex xs12>
        <formlistcomponent
          :items.sync="collection.comments"
          label="Comments"
          nodatamessage="No comments added"
        >
          <template
            slot="form"
            slot-scope="props"
          >
            <v-flex xs12>
              <v-textarea
                v-model="props.newitem.textval"
                height="200"
                filled
                label="New Comment"
              />
            </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- zotero ref selection popup -->
    <v-layout
      column
      justify-space-between
    >
      <v-dialog
        v-model="zoterodialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        @keydown.esc="zoterodialog=false"
      >
        <v-card>
          <v-toolbar
            dark
            color="primary"
          >
            <v-btn
              icon
              dark
              @click.native="zoterodialog=false"
            >
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Select Zotero Reference</v-toolbar-title>
            <v-spacer />
            <v-toolbar-items />
            <v-menu
              bottom
              right
              offset-y
            >
              <v-btn
                dark
                icon
              >
                <v-icon>more_vert</v-icon>
              </v-btn>
            </v-menu>
          </v-toolbar>
          <v-container
            grid-list-md
            text-xs-center
          >
            <zoterolist @selectref="pickZoteroRef($event)" />
          </v-container>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>
<script>
import autocomp from '../AutoCompleteComponents/Autocomp';
import formlistcomponent from '../FormComponents/FormListComponent';
import chips from '../FormComponents/Chips';
import datecomponent from '../FormComponents/DateComponent';
import zoterolist from '../ListViews/zotero_list';
import HELPERS from '../../helpers';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocomp,
    formlistcomponent,
    datecomponent,
    chips,
    zoterolist,
  },
  mixins: [HELPERS],
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
  mounted() {
    this.initVals();
    this.returnObject();
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
