<template>
  <div>
    <v-chip
      v-for="(item,index) in items"
      :key="index"
      outlined
      color="primary"
      small
    >
      {{ item }}
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
