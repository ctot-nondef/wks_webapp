<template>
  <div class="">
    <v-layout justify-end row fill-height>
      <!-- collection identifiers -->
      <chips :items="collection.identifier"/>
    </v-layout>
    <!-- collection name -->
    <v-text-field v-model="collection.name" label="Name" @input="returnObject()"></v-text-field>
    <!-- collection creators -->
    <formlistcomponent :items="collection.collector" :itemprops="$store.state.api.schemas.collect.properties.creator.items.properties" :listitemstyletypes="creatoritemstyletypes" label="Creator" nodatamessage="No creators added">
      <template slot="form" slot-scope="props">
       <v-flex xs5>
          <autocompdescriptor filter="ROLE" v-model="selecteddescriptor" label="Role" :multiple="false" @input="props.newitem.role=$event._id;returnObject();"></autocompdescriptor>
       </v-flex>
        <v-flex xs5>
       <autocompactor v-model="selectedactor" label="Collector" :multiple="false" @input="props.newitem.id=$event._id;returnObject();"></autocompactor>
      </v-flex>
      <v-flex xs12>
      <v-textarea  v-model="props.newitem.note" label="Note" /> 
      </v-flex> 
      </template>
    </formlistcomponent>
    <!-- collection places -->
    <autocompplace filter="PLACE" v-model="collection.place" label="Place" :multiple="true" @input="collection.place=$event;returnObject();"></autocompplace>
    <!-- collection times -->
    <autocompdescriptor filter="PERIOD" v-model="collection.time" label="Time" :multiple="false" @input="collection.time=$event;returnObject();"></autocompdescriptor>
    <!-- collection description -->
    <v-textarea v-model="collection.description" label="Description" @input="returnObject()"></v-textarea>
    <!-- collection documents -->
    <v-list two-line>
      <template v-for="(item, index) in collection.documents">
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
    <input type="file" style="display: none"  ref="image"  accept="image/*"  @change="onFilePicked">
    <!-- collection classifications -->
    <formlistcomponent v-if="collection.classification" :items="collection.classification" :itemprops="$store.state.api.schemas.collect.properties.classification.items.properties" :listitemstyletypes="classificationitemstyletypes" label="Classification" nodatamessage="No classifications added">
      <template slot="form" slot-scope="props">
       <v-flex xs5>
          <autocompdescriptor  filter="ASPECT"  v-model="selectedclassificationaspect" label="Aspect"  @input="props.newitem.aspect = selectedclassificationaspect._id;returnObject();" :multiple="false"></autocompdescriptor>
       </v-flex>
       <v-flex xs5>
       <autocompdescriptor   v-model="selectedclassificationdescriptor" label="Descriptor" @input="props.newitem.descriptor = selectedclassificationdescriptor._id;returnObject();" :multiple="false"></autocompdescriptor>
      </v-flex>
      </template>
    </formlistcomponent>
    <!-- collection begin of existence -->
    <datecomponent v-bind:date.sync="collection.beginOfExistence" label="Begin of Existence"/>
    <!-- collection end of existence -->
    <datecomponent v-bind:date.sync="collection.endOfExistence" label="End of Existence"/>
    <!-- collection destitution -->
    <v-textarea v-model="collection.destitution" label="Destitution" @input="returnObject()"></v-textarea>
    <!-- collection references -->
    <!-- collection comments -->
    <formlistcomponent v-if="collection.comments" :items="collection.comments"  :listitemstyletypes="['title']" label="Comments" nodatamessage="No comments added">
      <template slot="form" slot-scope="props">
       <v-flex xs5> 
          <v-textarea  v-model="props.newitem.textval" label="New Comment"></v-textarea>
       </v-flex>
      </template>
    </formlistcomponent>
  </div>
</template>
<script>
import axios from 'axios';
import autocompactor from '../AutoCompleteComponents/AutocompActor';
import autocompplace from '../AutoCompleteComponents/AutocompPlace';
import autocompdescriptor from '../AutoCompleteComponents/AutocompDescriptor';
import formlistcomponent from '../FormComponents/FormListComponent';
import chips from '../FormComponents/Chips';
import datecomponent from '../FormComponents/DateComponent';
import HELPERS from "../../helpers";

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocompactor,
    autocompplace,
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
      collection: {},
      title: '',
      description: '',
      comment: '',
      public: false,
      url: '',
      imageName: '',
  		imageUrl: '',
  		imageFile: '',
      selecteddescriptor:null,
      selectedactor:null,
      selectedclassificationaspect: null,
      selectedclassificationdescriptor: null,
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
          formData.append('image', this.imageFile);
          axios.post('https://wksgoose.acdh-dev.oeaw.ac.at/api/v1/upload/', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
          }).then((res) => {
            if(!this.collection.documents) this.collection.documents = [];
            this.collection.documents.push(res.data);
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
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
