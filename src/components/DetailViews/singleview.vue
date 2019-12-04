<template>
  <div>
    <v-list class="elevation-1" height="70">
      <v-list-item>
        <v-list-item-avatar>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <span class="body-2 font-weight-light">{{ title }}</span>
        </v-list-item-content>
        <v-list-item-content >
          <span class="body-2">{{ item }}</span>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
  export default {
    props: {
      icon: {
        type: String,
        default: () => "code",
      },
      title: {
        type: String,
        default: () => "",
      },
      item: {
        type: String,
        default: () => "",
      },
    },
  };
</script>
