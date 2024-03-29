<template>
  <div>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      :label="label"
      flat
      chips
      item-text="name"
      item-value="_id"
      cache-items
      return-object
      :multiple="multiple"
      :append-outer-icon="icon"
      hide-selected
      hide-no-data
      filled
      @input="$emit('input', select)"
      @click:append-outer="runfunc"
    >
      <template
        slot="selection"
        slot-scope="data"
      >
        <template v-if="multiple">
          <v-chip
            :input-value="data.selected"
            close
            class="chip--select-multi"
            color="white"
            @click:close="remove(data.item)"
          >
            {{ data.item.name }}
          </v-chip>
        </template>
        <template v-else>
          {{ data.item.name }}
        </template>
      </template>
      <template
        slot="item"
        slot-scope="data"
      >
        <template v-if="typeof data.item !== 'object'">
          <v-list-item-content v-text="data.item" />
        </template>
        <template v-else>
          <v-list-item-content class="listcontent">
            <v-list-item-title v-html="data.item.name" />
            <v-list-item-subtitle
              v-for="(prop,propname) in displayitemprops"
              :key="propname"
              class="subpropwrapper"
            >
              <span
                v-for="(subprop,index) in prop"
                :key="index"
                class="subprop"
              >{{ getItemPropFromPath(data.item,index,subprop['path']) | renderProps }}</span>
            </v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
  /* eslint-disable no-underscore-dangle,no-console */

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
      'defaultitems',
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
      search(newval) {
        if (newval) {
          this.querySelections(newval);
        }
      },
      value: {
        deep: true,
        immediate: true,
        handler(val) {
          if (this.multiple === true) {
            if (Array.isArray(val)) {
              this.select = val;
              this.items = val;
            } else {
              this.select = [];
              this.items = [];
            }
          } else if (typeof val === 'object' && val !== null) {
            this.select = val;
            this.items.push(val);
          } else {
            this.select = {};
            this.items = [];
          }
        }
      },
    },
    methods: {
      getItemPropFromPath(obj, index, path) {
        let res = obj;
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
        const queryparams = { name: { $regex: this.search || null } };
        const requestparams = {
          type: this.entity,
          limit: 20,
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
        requestparams.query = queryparams;
        this.get(requestparams)
        .then((res) => {
          if (Array.isArray(res.body)) this.items = res.body;
          this.loading = false;
        })
        .catch(() => {
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
        const index = this.select.map(e => e._id).indexOf(item._id);
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
              } else if (typeof value[key] === 'object' && value[key] !== null) {
                newvalue += `${value[key].name} `;
              }
            });
          } else {
            newvalue = value;
          }
        }
        return newvalue;
      },
    },
    mounted() {
      this.querySelections();
    }
};
</script>
<style>
.v-list a {height:auto;}
</style>
