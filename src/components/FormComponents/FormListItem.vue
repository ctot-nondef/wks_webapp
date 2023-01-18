<template>
  <div>
    <v-list-item-title
      v-if="styletype==='title'"
      v-text="name || refsto"
    />
    <v-list-item-subtitle
      v-if="styletype==='subtitle'"
      v-text="name || refsto"
    />
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
