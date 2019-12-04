<template>
  <div>
    <v-chip outlined color="primary" small v-for="(item,index) in items" v-bind:key="index">
      {{item}}
    </v-chip>
  </div>
</template>

<script>

export default {
  props: [
    'items',
  ],
};
</script>
