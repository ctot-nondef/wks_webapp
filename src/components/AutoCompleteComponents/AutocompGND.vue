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
        <template v-if="multiple">
          <v-chip :input-value="data.selected" close class="chip--select-multi" color="white">
            {{ data.item.label }}
          </v-chip>
        </template>
        <template v-else>
          {{ data.item.label }}
        </template>
      </template>
      <template slot="item" slot-scope="data">
        <template>
            <v-list-item-avatar>
                 <img v-if="data.item.image" :src="data.item.image">
                 <v-icon v-if="!data.item.image">person</v-icon>
               </v-list-item-avatar>
            <v-list-item-content>
            <v-list-item-title v-html="data.item.label"></v-list-item-title>
            <v-list-item-subtitle v-html="data.item.category"></v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </template>
    </v-autocomplete>
</template>

<script>
  /* eslint-disable no-underscore-dangle */
import { mapActions } from 'vuex';
import HELPERS from '../../helpers';

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
      search(newval) {
        if (newval) this.querySelections(newval);
      },
      value(val) {
        this.select = val;
        this.items = [val];
      },
    },
    methods: {
      querySelections() {
        this.loading = true;
        this.APIS.GND.SEARCH.get('', { params:
        {
          q: this.search,
          format: 'json:suggest',
          filter: this.type ? `type:${this.type}` : '',
        },
        })
        .then((res) => {
          this.items = res.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
      },
      ...mapActions('api', [
        'get',
      ]),
      remove(item) {
        const index = this.select.findIndex(r => r._id === item._id);
        if (index >= 0) this.select.splice(index, 1);
        this.$emit('input', this.select);
      },
    },
};
</script>
