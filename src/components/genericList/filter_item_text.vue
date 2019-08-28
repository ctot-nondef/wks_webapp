<template>
  <v-text-field
    v-model="value"
    :label="label"
    @input="this.$emit('input', $event)"
    append-icon="close"
    :append-icon-cb="clearFilter"
  ></v-text-field>
</template>

<script>
import { mapGetters } from 'vuex';
import fundamentcard from '../Fundament/FundamentCard';

export default {
    components: {
      fundamentcard,
    },
    props: {
      filter: {
        type: Object,
        default: () => {},
      },
      label: {
        type: String,
        default: () => '',
      },
    },
    data() {
      return {
        f: {},
      };
    },
    watch: {
      f: {
        handler(f) {
          console.log(f);
        },
        deep: true,
      },
    },
    methods: {
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
