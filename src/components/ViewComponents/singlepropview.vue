<template>
  <div>
    <v-list
      class="elevation-1"
      height="70"
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <span class="body-2 font-weight-light">{{ title }}</span>
        </v-list-item-content>
        <v-list-item-content>
          <span class="body-2">{{ intitem }}</span>
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
        default: () => "",
      },
    },
    data() {
      return {
        intitem: "",
      };
    },
    watch: {
      item: {
        immediate: true,
        handler(a) {
          if (typeof a === 'string') this.intitem = a;
          else if (a && a.name) this.intitem = a.name;
          else if (a && a[0]) this.intitem = a[0].name;
        },
        deep: true,
      },
    },
  };
</script>
