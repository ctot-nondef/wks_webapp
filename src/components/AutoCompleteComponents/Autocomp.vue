<template>
<div>
    <v-autocomplete
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      :label="label"
      flat chips
      v-model="select"
      item-text="name"
      item-value="_id"
      cache-items
      return-object
      @input="$emit('input', select)"
      :multiple="multiple"
      :append-outer-icon="icon"
      @click:append-outer="runfunc"
      hide-selected
      hide-no-data
      >
    <template slot="selection" slot-scope="data">
        <template v-if="multiple">
          <v-chip :selected="data.selected" close class="chip--select-multi" @input="remove(data.item)" color="white">
            {{ data.item.name }}
          </v-chip>
        </template>
        <template v-else>
         {{ data.item.name }}
        </template>
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
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import HELPERS from '../../helpers';

export default {
  mixins: [HELPERS],
  props: [
    'value',
    'label',
    'multiple',
    'entity',
    'filter',
    'icon',
    'clickevent'
  ],
  data() {
    return {
      loading: false,
      items: [],
      select: [] || '',
      search: null,
    };
  },
  watch: {
    search(newval, oldval) {
      if (newval) {
        this.querySelections(newval);
      }
    },
    value(val) {
      if (this.multiple === true) {
        this.select = val;
        this.items = val;
      } else {
          this.select = val;
          this.items.push(val);
        }
    },
  },
  methods: {
    clear() {
      this.select = null;
      this.items.length = 0;
    },
    runfunc(func) {
      if (this.clickevent) {
        this.clickevent();
      }
    },
    querySelections() {
      this.loading = true;
      // this.$info(vm);
     let filterval = '';
     const queryparams = {name: { "$regex": this.search || '' }};
     if (this.filter) {
         filterval = this.filterDescriptors(this.filter);
         queryparams.instanceOf = filterval;
     }
      this.get({
        type: this.entity,
        query: JSON.stringify(
          queryparams
        )
      })
      .then(res => {
        if (Array.isArray(res.data)) this.items = res.data;
        this.loading = false;
      })
      .catch(res => {
        this.$debug(res);
        this.loading = false;
      });
    },
    ...mapActions('api', [
      'get',
    ]),
    ...mapGetters('api', [
      'getClassByName'
    ]),
    filterDescriptors(descriptortype) {
      return this.$store.state.api.classes[this.entity].find(item => item.name === descriptortype)._id;
    },
     remove(item) {
      const index = this.select.indexOf(item._id);
      if (index >= 0) this.select.splice(index, 1);
      this.$emit("input", this.select);
    }
  },
  created() {
  }
};
</script>
