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
          <v-list-tile-content class="listcontent">
            <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
            <v-list-tile-sub-title class="subpropwrapper" v-for="(prop,propname) in displayitemprops" :key="propname" v-if="displayitemprops" >
              <span class="subprop" v-for="(subprop,index) in prop" :key="index">{{getItemPropFromPath(data.item,index,subprop['path']) | renderProps}}</span>
            </v-list-tile-sub-title>
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
    'clickevent',
    'displayitemprops',
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
    getItemPropFromPath(obj, index, path) {
      var res = obj;
      if (path.includes('.')) {
        path.split('.').forEach((key) => {
          if (res.length) res = res[index];
          else res = res[key];
        });
      } else res = obj[path];
      return res;
    },
    clear() {
      this.select = null;
      this.items.length = 0;
    },
    runfunc() {
      if (this.clickevent) {
        this.clickevent();
      }
    },
    querySelections() {
      this.loading = true;
      let filterval = '';
      const queryparams = { name: { $regex: this.search || '' } };
      const requestparams = {
        type: this.entity,
      };
      if (this.filter) {
        filterval = this.filterDescriptors(this.filter);
        queryparams.instanceOf = filterval;
      }
      if (this.displayitemprops) {
        const populateprops = [];
        Object.keys(this.displayitemprops).forEach((key) => {
          this.displayitemprops[key].forEach((obj) => {
            if (obj.populate === true) {
              populateprops.push({ path: obj.path, select: obj.select });
            }
          });
        });
        requestparams.populate = JSON.stringify(populateprops);
      }

      requestparams.query = JSON.stringify(queryparams);
      this.get(requestparams)
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
    ...mapGetters('api', [
      'getClassByName',
    ]),
    filterDescriptors(descriptortype) {
      return this.$store.state.api.classes[this.entity]
        .find(item => item.name === descriptortype)._id;
    },
    remove(item) {
      const index = this.select.indexOf(item._id);
      if (index >= 0) this.select.splice(index, 1);
      this.$emit('input', this.select);
    },
  },
  filters: {
    renderProps: (value) => {
      let newvalue = '';
      if (value) {
        if (typeof value !== 'string') {
        Object.keys(value).forEach((key) => {
          if (typeof value[key] === 'string' || typeof value[key] === 'number') {
            newvalue += `${value[key]} `;
          } else { newvalue += `${value[key].name} `; }
        });
      } else {
        newvalue = value;
      }
      }
      return newvalue;
    },
  },
};
</script>
<style>
.v-list a {height:auto;}
</style>
