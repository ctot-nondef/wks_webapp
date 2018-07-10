<template>
    <v-select
      :loading="loading"
      :items="items"
      :rules="[() => select.length > 0 || 'You must choose at least one']"
      :search-input.sync="search"
      v-model="select"
      :label="name"
      autocomplete
      multiple
      cache-items
      chips
      item-text="prefLabel"
      item-value="uri"
      @input="$emit('input', select)"
      >
      <template slot="selection" slot-scope="data">
        <v-chip
          :selected="data.selected"
          :key="JSON.stringify(data.item)"
          close
          class="chip--select-multi"
          @input="data.parent.selectItem(data.item)"
        >
          <v-avatar>
            <v-icon>{{typeicon(data.item.type)}}</v-icon>
          </v-avatar>
          {{ data.item.prefLabel }}
        </v-chip>
      </template>
      <template slot="item" slot-scope="data">
        <template v-if="typeof data.item !== 'object'">
          <v-list-tile-content v-text="data.item"></v-list-tile-content>
        </template>
        <template v-else>
          <v-list-tile-avatar>
            <v-icon>{{typeicon(data.item.type[0])}}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="data.item.prefLabel"></v-list-tile-title>
            <v-list-tile-sub-title v-html="data.item.uri"></v-list-tile-sub-title>
          </v-list-tile-content>
        </template>
      </template>
    </v-select>
</template>

<script>

import HELPERS from '../helpers';
/* eslint no-param-reassign: ["error", { "props": false }] */

export default {
  mixins: [HELPERS],
  props: [
    'type',
    'name',
  ],
  name: 'AutocompVocabs',
  data() {
    return {
      loading: false,
      items: [],
      search: null,
      select: [],
    };
  },
  watch: {
    search(val) {
      this.querySelections(val);
    },
  },
  methods: {
    querySelections() {
      this.loading = true;
      // this.$info(vm);
      this.getVocabsByID(escape((this.search || '').trim()), this.type)
      .then((res) => {
        // this.$debug(res);
        if (Array.isArray(res.results)) this.items = res.results;
        this.loading = false;
      })
      .catch((res) => {
        this.$debug(res);
        this.loading = false;
      });
    },
  },
  created() {

  },
};
</script>
