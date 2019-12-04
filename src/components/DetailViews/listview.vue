<template>
  <div>
    <v-list dense>
      <v-list-tile>
        <v-list-tile-avatar>
              <v-icon>{{ icon }}</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <span class="title font-weight-thin">{{ title }}</span>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon>expand_less</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-divider></v-divider>
    <v-list v-if="actorsexpanded">
      <v-list-tile v-for="a in items">
        <v-list-tile-content>
          <v-list-tile-title>{{ a.role.name }} :</v-list-tile-title>
          <v-list-tile-sub-title>{{ a.id.name }}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-content class="align-end">{{ a.id.name }}</v-list-tile-content>
      </v-list-tile>
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
