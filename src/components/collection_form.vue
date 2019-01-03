<template>
  <div class="">
    <v-text-field v-model="collection.name" label="Name" @input="returnObject()"></v-text-field>
    <autocompactor v-model="collection.collector" label="Collector" :multiple="true" @input="collection.collector=$event;returnObject();"></autocompactor>
    <autocompplace v-model="collection.place" label="Place" :multiple="true" @input="collection.place=$event;returnObject();"></autocompplace>
    <v-text-field v-model="collection.beginOfExistence" label="Begin of Existence" @input="returnObject()"></v-text-field>
    <v-text-field v-model="collection.endOfExistence" label="End of Existence" @input="returnObject()"></v-text-field>
    <v-textarea v-model="collection.description" label="Description" @input="returnObject()"></v-textarea>
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
  </div>
</template>
<script>
import axios from 'axios';
import autocompactor from './AutocompActor';
import autocompplace from './AutocompPlace';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocompactor,
    autocompplace,
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
    };
  },
  watch: {
    value(val) {
      this.collection = val;
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
