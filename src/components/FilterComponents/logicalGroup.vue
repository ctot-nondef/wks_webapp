<template>
  <v-row>
    <slot name="filter" :value="Object.values(value)[0]">

    </slot>
    <v-btn-toggle v-model="Object.keys(value)[0]">
      <v-btn>
        <v-icon>mdi-set-center</v-icon>
      </v-btn>
      <v-btn>
        <v-icon>mdi-set-all</v-icon>
      </v-btn>
    </v-btn-toggle>
  </v-row>
</template>
<script>
/* eslint-disable no-underscore-dangle */


/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
  },
  props: [
    'key',
    'value',
  ],
  data() {
    return {
      model: {},
    };
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val &&
            typeof val === 'object' &&
            Object.keys(val)[0] === ("$and" || "$or") ) this.model = val;
        else this.model = { $or: [] };
      },
    },
    model: {
      deep: true,
      handler(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
  },
};
</script>
