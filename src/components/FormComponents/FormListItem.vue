<template>
  <div>
    <v-list-tile-title v-if="styletype==='title'" v-text="name || refsto" ></v-list-tile-title>
    <v-list-tile-sub-title v-if="styletype==='subtitle'" v-text="name || refsto"></v-list-tile-sub-title>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import HELPERS from '../../helpers';

export default {

  mixins: [HELPERS],
  props: [
    'styletype',
    'itemprop',
    'refsto',
  ],
  data() {
    return {
      name: null,
    };
  },
  methods: {
    ...mapActions('api', ['get']),
  },
};
</script>
