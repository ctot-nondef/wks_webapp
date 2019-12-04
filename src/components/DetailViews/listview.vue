<template>
  <div>
    <v-list dense>
      <v-list-item>
        <v-list-item-avatar>
              <v-icon>{{ icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <span class="title font-weight-thin">{{ title }}</span>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon>expand_less</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list v-if="actorsexpanded">
      <v-list-item v-for="a in items">
        <v-list-item-content>
          <v-list-item-title>{{ a.role.name }} :</v-list-item-title>
          <v-list-item-subtitle>{{ a.id.name }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-content class="align-end">{{ a.id.name }}</v-list-item-content>
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
      'title',
      'subtitle',

    ],
    mixins: [filters],
    data() {
      return {
        expanded: true,
      };
    },
    methods: {
    },
    watch: {
    },

  };
</script>
