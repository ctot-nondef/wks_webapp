<template>
  <div>
    <v-chip outline color="primary" small v-for="(item,index) in items" v-bind:key="index">
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
