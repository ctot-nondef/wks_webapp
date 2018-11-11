<template>
    <v-autocomplete
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      v-model="select"
      label="Kategorie"
      flat
      hide-no-data
      item-text="name"
      return-object
      @input="$emit('input', select)"
      >
      <template slot="item" slot-scope="data">
        <template v-if="typeof data.item !== 'object'">
          <v-list-tile-content v-text="data.item"></v-list-tile-content>
        </template>
        <template v-else>
          <v-list-tile-content>
            <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
            <v-list-tile-sub-title v-html="data.item.notation"></v-list-tile-sub-title>
          </v-list-tile-content>
        </template>
      </template>
    </v-autocomplete>
</template>

<script>
import { mapActions } from 'vuex';
import HELPERS from '../helpers';

export default {
  mixins: [HELPERS],
  props: [
    'value',
  ],
  name: 'AutocompCategories',
  data() {
    return {
      loading: false,
      items: this.value || [],
      select: this.value || [],
      search: null,
    };
  },
  watch: {
    search(val) {
      this.querySelections(val);
    },
    value(val) {
      this.items = val;
      this.select = val;
    },
  },
  methods: {
    querySelections() {
      this.loading = true;
      // this.$info(vm);
      this.get({ type: 'categories', name: escape((this.search || '').trim()) })
      .then((res) => {
        if (Array.isArray(res.data.results)) this.items = res.data.results;
        this.loading = false;
      })
      .catch((res) => {
        this.$debug(res);
        this.loading = false;
      });
    },
    ...mapActions('api', [
      'get',
    ]),
  },
  created() {

  },
};
</script>
