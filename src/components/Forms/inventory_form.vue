<template>
  <div class="">
    <v-layout justify-end row fill-height>
      <!-- inventory identifiers -->
      <chips :items="inventory.identifier"/>
    </v-layout>
    <!-- inventory name -->
    <v-text-field v-model="inventory.name" label="Name" @input="returnObject()"></v-text-field>
    <!-- inventory creators -->
    <formlistcomponent :items="inventory.creator" :itemprops="$store.state.api.schemas.inventory.properties.creator.items.properties" :listitemstyletypes="creatoritemstyletypes" label="Creator" nodatamessage="No creators added">
      <template slot="form" slot-scope="props">
       <v-flex xs5>
          <autocompdescriptor filter="ROLE" v-model="selecteddescriptor" label="Role" :multiple="false" @input="props.newitem.role=$event._id;returnObject();"></autocompdescriptor>
       </v-flex>
        <v-flex xs5>
       <autocompactor v-model="selectedactor" label="Creator" :multiple="false" @input="props.newitem.id=$event._id;returnObject();"></autocompactor>
      </v-flex>
      <v-flex xs12>
      <v-textarea  v-model="props.newitem.note" label="Note" /> 
      </v-flex> 
      </template>
    </formlistcomponent>
    <!-- inventory place -->
    <autocompplace filter="PLACE" v-model="inventory.place" label="Place" :multiple="false" @input="inventory.place=$event;returnObject();"></autocompplace>
    <!-- inventory begin of existence -->
    <datecomponent v-bind:date.sync="inventory.beginOfExistence" label="Begin of Existence"/>
    <!-- inventory end of existence -->
    <datecomponent v-bind:date.sync="inventory.endOfExistence" label="End of Existence"/>
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
    <!-- inventory references -->
    <!-- inventory classifications -->
    <formlistcomponent v-if="inventory.classification" :items="inventory.classification" :itemprops="$store.state.api.schemas.inventory.properties.classification.items.properties" :listitemstyletypes="classificationitemstyletypes" label="Classification" nodatamessage="No classifications added">
      <template slot="form" slot-scope="props">
       <v-flex xs5>
          <autocompdescriptor  filter="ASPECT"  v-model="selectedclassificationaspect" label="Aspect"  @input="props.newitem.aspect = selectedclassificationaspect._id;returnObject();" :multiple="false"></autocompdescriptor>
       </v-flex>
       <v-flex xs5>
       <autocompdescriptor   v-model="selectedclassificationdescriptor" label="Descriptor" @input="props.newitem.descriptor = selectedclassificationdescriptor._id;returnObject();" :multiple="false"></autocompdescriptor>
      </v-flex>
      </template>
    </formlistcomponent>
    <!-- inventory partOf -->
     <v-flex xs5>
          <autocompcollection  v-model="inventory.partOf" label="part Of Collection" :multiple="false"></autocompcollection>
       </v-flex>
    </div>
</template>
<script>
import axios from 'axios';
import autocompactor from '../AutoCompleteComponents/AutocompActor';
import autocompplace from '../AutoCompleteComponents/AutocompPlace';
import datecomponent from '../FormComponents/DateComponent';
import autocompdescriptor from '../AutoCompleteComponents/AutocompDescriptor';
import autocompcollection from '../AutoCompleteComponents/AutocompCollection';
import formlistcomponent from '../FormComponents/FormListComponent';
import chips from '../FormComponents/Chips';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocompactor,
    autocompplace,
    autocompdescriptor,
    autocompcollection,
    formlistcomponent,
    datecomponent,
    chips,
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
      selecteddescriptor:{},
      selectedactor:{},
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
    };
  },
  watch: {
    value(val) {
      this.inventory = val;
      if(!this.inventory.creator) {
        this.$set(this.inventory,'creator',[]);
      }
      else if (!this.inventory.classification) {
        this.$set(this.inventory,'classification',[]);
      }
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', this.inventory);
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
            if(!this.inventory.documents) this.inventory.documents = [];
            this.inventory.documents.push(res.data);
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
      this.inventory.documents.splice(index, 1);
      this.returnObject();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
