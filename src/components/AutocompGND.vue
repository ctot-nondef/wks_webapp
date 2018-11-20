<template>
    <v-autocomplete
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      v-model="select"
      :label="label"
      flat
      hide-no-data
      item-text="label"
      return-object
      @input="$emit('input', select)"
      :multiple="multiple"
      >
      <template slot="selection" slot-scope="data">
          <v-chip :selected="data.selected" close class="chip--select-multi" color="white">
            {{ data.item.label }}
          </v-chip>
      </template>
      <template slot="item" slot-scope="data">
        <template>
            <v-list-tile-avatar>
                 <img v-if="data.item.image" :src="data.item.image">
                 <v-icon v-if="!data.item.image">person</v-icon>
               </v-list-tile-avatar>
            <v-list-tile-content>
            <v-list-tile-title v-html="data.item.label"></v-list-tile-title>
            <v-list-tile-sub-title v-html="data.item.category"></v-list-tile-sub-title>
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
    'type',
  ],
  data() {
    return {
      loading: false,
      items: [],
      select: this.value || [],
      search: null,
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
      this.items = val;
    },
  },
  methods: {
    querySelections() {
      this.loading = true;
      this.APIS.GND.SEARCH.get('',{ params:
        {
          q: this.search,
          format: "json:suggest",
          filter: this.type ? `type:${this.type}` : '',
        },
      })
      .then((res) => {
        console.log(res.data);
        this.items = res.data;
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
       if (index >= 0) this.select.splice(index, 1);
       this.$emit('input', this.select);
     }
  },
  created() {

  },
};
</script>
