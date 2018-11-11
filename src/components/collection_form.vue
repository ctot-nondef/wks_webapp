<template>
  <div class="">
    <v-text-field v-model="title" label="Title" @input="returnObject()"></v-text-field>
    <v-textarea v-model="description" label="Description" @input="returnObject()"></v-textarea>
    <v-textarea v-model="comment" label="Comment" @input="returnObject()"></v-textarea>
    <v-checkbox v-model="public" :label="`Public: ${public.toString()}`"  @input="returnObject()"></v-checkbox>
  </div>
</template>
<script>
import autocompcategories from './AutocompCategories';

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocompcategories,
  },
  props: [
    'value',
  ],
  data() {
    return {
      title: '',
      description: '',
      comment: '',
      public: false,
      url: '',
    };
  },
  watch: {
    value(val) {
      this.title = val.title;
      this.description = val.description;
      this.comment = val.comment;
      this.public = val.public;
      this.url = val.url;
    },
  },
  methods: {
    returnObject() {
      this.$emit('input', {
        title: this.title,
        description: this.description,
        comment: this.comment,
        public: this.public,
        url: this.url,
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
