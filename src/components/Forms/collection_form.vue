<template>
  <div class="">
    <v-layout justify-end row fill-height>
        <!-- collection identifiers -->
        <chips :items="collection.identifier"/>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <!-- collection name -->
        <v-text-field v-model="collection.name" label="Name" @input="returnObject()"></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <!-- collection creators -->
        <formlistcomponent :items="collection.creator" :itemprops="$store.state.api.schemas.collect.properties.creator.items.properties" :listitemstyletypes="creatoritemstyletypes" label="Creator" nodatamessage="No creators added">
          <template slot="form" slot-scope="props">
          <v-flex xs5>
              <autocomp entity="descriptor" filter="ROLE" v-model="props.newitem.role" label="Role" :multiple="false"></autocomp>
          </v-flex>
            <v-flex xs5>
          <autocomp entity="actor" v-model="props.newitem.id" label="Collector" :multiple="false"></autocomp>
          </v-flex>
          <v-flex xs12>
          <v-textarea v-model="props.newitem.note" label="Note" />
          </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <v-layout justify-end row fill-height>
      <v-flex xs12>
      <!-- collection places -->
        <autocomp entity="descriptor" filter="PLACE" v-model="collection.place" label="Place" :multiple="true" @input="returnObject();"></autocomp>
      </v-flex>
    </v-layout>
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <!-- collection times -->
        <autocomp entity="descriptor" filter="PERIOD" v-model="collection.time" label="Time" :multiple="true" @input="returnObject();"></autocomp>
      </v-flex>
    </v-layout>
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <!-- collection description -->
        <v-textarea v-model="collection.description" label="Description" @input="returnObject()"></v-textarea>
      </v-flex>
    </v-layout>
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <!-- collection documents -->
        <v-list two-line>
          <template v-for="(item, index) in collection.documents">
            <v-list-tile :key="item._id" avatar :href="`${$store.state.api.url}/${item.ref.path}`">
              <v-list-tile-avatar>
                <img :src="`${$store.state.api.url}/uploads/thumbs/${item.ref.name.split('.')[0]}_thumb.jpg`">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.ref.name"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.ref.path"></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-btn fab dark small color="error" @click="removeimage(index)">
                <v-icon dark>delete</v-icon>
              </v-btn>
            </v-list-tile>
          </template>
        </v-list>
        <v-text-field label="Select PDF Document" @click='pickFile' v-model='imageName' prepend-icon='attach_file'></v-text-field>
        <input type="file" style="display: none" ref="image" accept="application/pdf" @change="onFilePicked">
      </v-flex>
    </v-layout>
    <v-layout justify-end row fill-height>
      <v-flex xs12>
        <!-- collection classifications -->
        <formlistcomponent v-if="collection.classification" :items="collection.classification" :itemprops="$store.state.api.schemas.collect.properties.classification.items.properties" :listitemstyletypes="classificationitemstyletypes" label="Classification" nodatamessage="No classifications added">
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
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <!-- collection begin of existence -->
        <datecomponent v-bind:date.sync="collection.beginOfExistence" label="Begin of Existence"/>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs6>
        <!-- collection end of existence -->
        <datecomponent v-bind:date.sync="collection.endOfExistence" label="End of Existence"/>
      </v-flex>
    </v-layout>
    <v-layout justify-start row fill-height>
      <v-flex xs12>
        <!-- collection destitution -->
        <v-textarea v-model="collection.destitution" label="Destitution" @input="returnObject()"></v-textarea>
      </v-flex>
    </v-layout>
    <!-- collection references zotero? -->
    <v-layout justify-start row fill-height>
      <v-flex xs12>
      <!-- collection comments -->
        <formlistcomponent v-if="collection.comments" :items="collection.comments" :listitemstyletypes="['title']" label="Comments" nodatamessage="No comments added">
          <template slot="form" slot-scope="props">
          <v-flex xs12>
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
import formlistcomponent from '../FormComponents/FormListComponent';
import chips from '../FormComponents/Chips';
import datecomponent from '../FormComponents/DateComponent';
import HELPERS from "../../helpers";

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  mixins: [HELPERS],
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
      collection: {},
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
        'subtitle'
      ],
      classificationitemstyletypes: [
        'title',
        'subtitle'
      ],
      beginofexistencemenu: false,
      endofexistencemenu: false,
      newcomment: '',
    };
  },
  watch: {
    value(val) {
      this.collection = val;
      if (!this.collection.classification) {
        this.$set(this.collection,'classification',[]);
      }
      if (!this.collection.creator) {
        this.$set(this.collection,'creator',[]);
      }
      if (!this.collection.comments) {
        this.$set(this.collection,'comments',[]);
      }
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', this.collection);
    },
    pickFile () {
      this.$refs.image.click ()
    },
		onFilePicked (e) {
			const files = e.target.files
			if(files[0] !== undefined) {
				this.imageName = files[0].name
				if(this.imageName.lastIndexOf('.') <= 0) {
					return
				}
				const fr = new FileReader ()
				fr.readAsDataURL(files[0])
				fr.addEventListener('load', () => {
					this.imageUrl = fr.result
					this.imageFile = files[0] // this is an image file that can be sent to server...
          console.log(this.imageFile);
          var formData = new FormData();
          formData.append('file', this.imageFile);
          axios.post('https://wksdev.hephaistos.arz.oeaw.ac.at/api/v1/upload/', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
          }).then((res) => {
            console.log(this.collection);
            if(!this.collection.documents) this.collection.documents = [];
            this.collection.documents.push({ref: res.data, note: 'test'});
            console.log(this.collection);
            this.returnObject();
            this.imageName = '';
            this.imageFile = '';
            this.imageUrl = '';
          });
				})
			} else {
				this.imageName = ''
				this.imageFile = ''
				this.imageUrl = ''
			}
		},
    removeimage(index) {
      this.collection.documents.splice(index, 1);
      this.returnObject();
      console.log(this.collection);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
