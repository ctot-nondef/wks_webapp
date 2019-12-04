<template>
  <div>
    <v-list
      class="elevation-1"
    >
      <v-list-item>
        <v-list-item-avatar>
              <v-icon>{{ icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <span class="title font-weight-light">{{ title }}</span>
        </v-list-item-content>
        <v-list-item-content v-if="!expanded">
          <span class="body-2">{{ _.get( items[0], paths.itemcontent ) }}</span>
        </v-list-item-content>
        <v-list-item-action @click="expanded = !expanded">
          <v-btn icon ripple><v-icon>{{ expanded ? "expand_less" : "expand_more"  }}</v-icon></v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list
      v-if="expanded"
      dense
      class="elevation-1"
    >
      <v-list-item v-for="(item, index) in items" :key="index">
        <v-list-item-content>
          <v-list-item-title>{{ _.get( item, paths.itemtitle ) }} :</v-list-item-title>
          <v-list-item-subtitle>{{ _.get( item, paths.itemsubtitle ) }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-content class="align-end">{{ _.get( item, paths.itemcontent ) }}</v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
  /* eslint-disable no-underscore-dangle */
import filters from '../../helpers/filters';

  export default {
    props: [
      'icon',
      'title',
      'items',
      'paths',
      'expanded',
    ],
    mixins: [filters],
    data() {
      return {
      };
    },
    methods: {
    },
    watch: {
    },
  };
</script>
