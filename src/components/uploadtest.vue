<template>
  <div class="">
    <v-layout justify-end row fill-height>
      <v-flex xs10>
        <v-text-field v-model="fenster.name" label="Name" @input="returnObject()"></v-text-field>
      </v-flex>
      <v-flex xs2>
        <v-select v-model="fenster.stufe" :items="['Fenster','Szene','Scheibe']" label="Stufe"></v-select>
      </v-flex>
    </v-layout>
    <v-layout justify-end row fill-height>
      <v-flex xs2>
        <v-text-field v-model="fenster.created" label="Begin of Existence" @input="returnObject()"></v-text-field>
      </v-flex>
      <v-flex xs10>
      </v-flex>
    </v-layout>
    <autocompkeyword v-model="fenster.classification" label="Schlagwort" :multiple="true" @input="fenster.classification=$event;returnObject();"></autocompkeyword>
    <v-list two-line>
      <template v-for="(item, index) in fenster.images">
        <v-list-tile :key="item._id" avatar  @click="">
          <v-list-tile-avatar>
            <img :src="`https://cvagoose.acdh-dev.oeaw.ac.at/${item.path.split('.')[0]}_thumb.jpg`">
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
    <v-list two-line>
      <template v-for="(item, index) in fenster.references">
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.ref"></v-list-tile-title>
            <v-list-tile-sub-title v-html="item.pageno"></v-list-tile-sub-title>
          </v-list-tile-content>
          <v-btn fab dark small color="error" @click="removereference(index)">
            <v-icon dark>delete</v-icon>
          </v-btn>
        </v-list-tile>
      </template>
    </v-list>
    <v-layout justify-end row fill-height>
      <v-flex xs5>
        <v-text-field label="Reference" v-model='newreference.ref'></v-text-field>
      </v-flex>
      <v-flex xs5>
        <v-text-field label="PageNo" v-model='newreference.pageno'></v-text-field>
      </v-flex>
      <v-flex xs2>
        <v-btn fab dark small color="warning" @click="addreference()">
          <v-icon dark>edit</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-list>
      <template v-for="(item, index) in fenster.comments">
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title v-html="item"></v-list-tile-title>
          </v-list-tile-content>
          <v-btn fab dark small color="error" @click="removecomment(index)">
            <v-icon dark>delete</v-icon>
          </v-btn>
        </v-list-tile>
      </template>
    </v-list>
    <v-layout justify-end row fill-height>
      <v-flex xs10>
        <v-text-field label="Comment" v-model='newcomment'></v-text-field>
      </v-flex>
      <v-flex xs2>
        <v-btn fab dark small color="warning" @click="addcomment()">
          <v-icon dark>edit</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import axios from 'axios';
import autocompactor from './AutocompActor';
import autocompplace from './AutocompPlace';
import autocompkeyword from './AutocompDescriptor';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocompactor,
    autocompplace,
    autocompkeyword,
    autocompfenster,
    autocompstandort,
  },
  props: [
    'value',
  ],
  data() {
    return {
      fenster: {},
      title: '',
      description: '',
      comment: '',
      public: false,
      url: '',
      imageName: '',
  		imageUrl: '',
  		imageFile: '',
      newreference: {},
      newcomment: '',
    };
  },
  watch: {
    value(val) {
      this.fenster = val;
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', this.fenster);
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
          axios.post('https://cvagoose.acdh-dev.oeaw.ac.at/api/v1/upload/', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
          }).then((res) => {
            if(!this.fenster.images) this.fenster.images = [];
            this.fenster.images.push(res.data);
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
      this.fenster.images.splice(index, 1);
      this.returnObject();
    },
    removereference(index) {
      this.fenster.references.splice(index, 1);
      this.returnObject();
    },
    addreference() {
      if(!this.fenster.references) this.fenster.references = [];
      this.fenster.references.push(this.newreference);
      this.returnObject();
      this.newreference = {};
    },
    removecomment(index) {
      this.fenster.comments.splice(index, 1);
      this.returnObject();
    },
    addcomment() {
      if(!this.fenster.comments) this.fenster.comments = [];
      this.fenster.comments.push(this.newcomment);
      this.returnObject();
      this.newcomment = '';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
