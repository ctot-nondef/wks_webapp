<template>
  <transition appear :duration="250" name="fadeLeft">
    <v-card class="border-top mb-3" height="100%">
      <v-card-media :src="src" v-if="src" height="200px">
      </v-card-media>
      <v-card-title primary-title>
        <div>
          <h3 class="headline" v-text="caption">
            <slot name="caption"/>
          </h3>
        </div>
      </v-card-title>
      <div class="content">
        <slot name="content"/>
      </div>
      <v-card-actions v-if="link">
        <v-btn
          text
          class="primary"
          :to="link"
          >
          {{ buttoncaption || 'More' }}</v-btn>
      </v-card-actions>
    </v-card>
  </transition>
</template>

<script>

  export default {
    data() {
      return {
      };
    },
    props: [
      'src',
      'caption',
      'link',
      'buttoncaption'
    ],
    name: 'FundamentCard',
  };
</script>
<style scoped>

.content {
  padding: 0 16px 16px 16px;
}

</style>
