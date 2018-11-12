<template>
    <v-autocomplete
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      v-model="select"
      :label="label"
      flat
      hide-no-data
      item-text="name"
      return-object
      @input="$emit('input', select)"
      :multiple="multi"
      >
      <template slot="selection" slot-scope="data">
          <v-chip :selected="data.selected" close class="chip--select-multi" @input="remove(data.item)" color="white">
            {{ data.item.name }}
          </v-chip>
      </template>
      <template slot="item" slot-scope="data">
        <template v-if="typeof data.item !== 'object'">
          <v-list-tile-content v-text="data.item"></v-list-tile-content>
        </template>
        <template v-else>
          <v-list-tile-content>
            <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
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
    'label',
    'multiple',
  ],
  name: 'AutocompCategories',
  data() {
    return {
      loading: false,
      items: this.value || [],
      select: this.value || [],
      search: null,
      multi: this.multiple || false,
    };
  },
  watch: {
    search(newval, oldval) {
      if(newval) {
        this.querySelections(newval);
      }
    },
    value(val) {
      console.log(val);
      this.select = val;
    },
  },
  methods: {
    querySelections() {
      this.loading = true;
      // this.$info(vm);
      this.get({
        type: 'descriptor',
        query: JSON.stringify({
          name: {"$regex": escape((this.search || '').trim()) },
          instanceOf: "5be884e8add30d031e41bc10",
        })
      })
      .then((res) => {
        if (Array.isArray(res.data)) this.items = res.data;
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
    remove (item) {
       const index = this.select.findIndex(r => r._id === item._id);
       if (index >= 0) this.select.splice(index, 1)
     }
  },
  created() {

  },
};
</script>
