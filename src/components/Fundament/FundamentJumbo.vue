<template>
  <v-parallax
    :src="src"
    height="250"
    class="mt-4 mb-3 border-top"
  >
    <v-layout
      column
      align-center
      justify-center
    >
      <h1>{{ caption }}</h1>
      <p>{{ subtitle }}</p>
    </v-layout>
  </v-parallax>
</template>

<script>

  export default {
    name: 'FundamentJumbo',
    props: [
      'src',
      'caption',
      'subtitle',
    ],
    data() {
      return {
      };
    },
  };
</script>
<style scoped>



</style>
