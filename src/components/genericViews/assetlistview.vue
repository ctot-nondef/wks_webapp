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
        <v-list-item-content v-if="!intexpanded">
          <span class="body-2">{{ `${items.length} files attached` || "n/a" }}</span>
        </v-list-item-content>
        <v-list-item-action v-if="expandable">
          <v-btn icon :disabled="items.length <= 0"  @click="intexpanded = !intexpanded"><v-icon>{{ intexpanded ? "expand_less" : "expand_more"  }}</v-icon></v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list
      v-if="intexpanded && (items.length > 0)"
      dense
      class="elevation-1"
    >
      <v-list-item v-for="(item, index) in items" :key="index" :href="`${$store.state.api.url}/${item.ref.path}`" target="_blank">
        <v-list-item-avatar>
          <img :src="`${$store.state.api.url}/asset/uploads/thumbs/${item.ref.name.split('.')[0]}_thumb.jpg`">
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="item.ref.name"/>
          <v-list-item-subtitle v-html="item.ref.path"/>
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
      items: {
        type: Array,
        default: () => [],
      },
      paths: {
        type: Object,
        default: () => {},
      },
      expanded: {
        type: Boolean,
        default: () => false,
      },
      expandable: {
        type: Boolean,
        default: () => true,
      },
    },
    data() {
      return {
        intexpanded: false,
      }
    },
    watch: {
      expanded: {
        immediate: true,
        handler(a) {
          this.intexpanded = a;
        },
      },
    },
  };
</script>
