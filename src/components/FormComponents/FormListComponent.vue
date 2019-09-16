<template>
  <div class="formlist pa-3">
    <v-layout justify-start row fill-height class="pt-3 pb-3">
      <v-label>{{label}}</v-label>
    </v-layout>
    <!-- table view if array of objects -->
    <v-data-table v-if="itemprops"
        :headers="headers"
        :items="citems"
        class="elevation-1"
        disable-initial-sort
      >
    <template slot="headers" slot-scope="props">
      <th  v-for="header in props.headers">
        {{ header.name }}
      </th>
      <th>Actions</th>
    </template>
    <template slot="items" slot-scope="props">
     <tr>
        <td v-for="header in headers">
          <template v-if="typeof props.item === 'object' && props.item[header.name] && props.item[header.name].name">
             {{props.item[header.name].name}}
          </template>
          <!-- zotero refs for link parsing -->
          <template v-else-if="typeof props.item === 'object' && typeof props.item[header.name] === 'string' && header.name === 'ref'">
            <a :href="props.item[header.name].replace('api.', '')" target="_blank">link</a>
          </template>
          <!-- transaction refs -->
          <template v-else-if="typeof props.item === 'object' && typeof props.item[header.name] === 'object' && props.item[header.name] !== null && header.name === 'ref'">
            {{ props.item[header.name]._id }}
          </template>
          <template v-else>
            {{props.item[header.name]}}
          </template>
       </td>
       <td class="justify-center layout px-0">
        <v-icon
          small
          class="mr-2"
          @click="editItem(props.index)"
          :disabled="editingMode"
        >
          edit
        </v-icon>
        <v-icon
          small
          :disabled="editingMode"
          @click="removeItem(props.index,items)"
        >
          delete
        </v-icon>
      </td>
      </tr>
    </template>
    </v-data-table>
    <!-- list display if array of strings -->
    <v-list two-line v-if="!itemprops && citems.length >= 1">
      <v-list-tile v-for="(item, index) in items" v-bind:key="index">
        <v-list-tile-content>
          <v-list-tile-title v-if="typeof item === 'string'" v-text="item"></v-list-tile-title>
        </v-list-tile-content>
        <v-btn fab dark small color="error" @click="removeItem(index,items)">
          <v-icon dark>delete</v-icon>
        </v-btn>
      </v-list-tile>
    </v-list>
    <!-- form slot -->
    <v-layout justify-end row fill-height>
      <v-flex xs10>
        <slot name="form" :newitem="newitem"></slot>
      </v-flex>
      <v-flex xs2>
        <v-btn ref="addbutton" v-if="editingMode === false" center fab dark small color="warning" @click.native="addItem(newitem,items); clearItem()">
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-btn v-if="editingMode === true" center fab dark small color="warning" @click.native="saveItem(newitem,items)">
          <v-icon dark>save</v-icon>
        </v-btn>
        <v-btn v-if="editingMode === true" center fab dark small color="warning" @click.native="cancelEditing()">
          <v-icon dark>cancel</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import HELPERS from '../../helpers';
import formlistitem from './FormListItem';

export default {
  components: {
    formlistitem,
  },
  mixins: [HELPERS],
  props: [
    'label',
    'nodatamessage',
    'type',
    'items',
    'itemprops',
  ],
  data() {
    return {
      dialog: false,
      editedItem: null,
      editingMode: false,
      editingItemIndex: 0,
    };
  },
  watch: {
  },
  methods: {
    ...mapActions('api', ['get']),
    addItem(item, items) {
      if (!item.textval) {
        const newitem = Object.assign({}, item);
        items.push(newitem);
      } else {
        items.push(item.textval);
      }
    },
    removeItem(index, items) {
      items.splice(index, 1);
    },
    editItem(index) {
      this.editingMode = true;
      this.editingItemIndex = index;
      this.editedItem = this.items[index];
      Object.keys(this.itemprops).forEach((key) => {
        if (key !== '_id') {
          this.$set(this.newitem, key, this.editedItem[key] || '');
        }
      });
    },
    cancelEditing() {
      this.editingMode = false;
      this.clearItem();
    },
    saveItem() {
      Object.keys(this.itemprops).forEach((key) => {
        if (key !== '_id') {
          this.$set(this.items[this.editingItemIndex], key, this.newitem[key]);
        }
      });
      this.editingMode = false;
      this.clearItem();
    },
    clearItem() {
      Object.keys(this.newitem).forEach((key) => {
        if (key === 'textval') {
          this.$set(this.newitem, key, '');
        } else if (typeof this.newitem[key] === 'object') {
          this.$set(this.newitem, key, null);
        } else {
          this.$set(this.newitem, key, '');
        }
      });
      this.$children.forEach((child) => {
        if (Object.prototype.hasOwnProperty.call(child, 'form')) {
          child.reset();
        }
        if (Object.prototype.hasOwnProperty.call(child, 'select')) {
          child.clear();
          this.$set(child.$children[0], 'cachedItems', []);
        }
      });
    },
  },
  computed: {
    headers() {
      const hdrs = [];
      Object.keys(this.itemprops).forEach((key) => {
        if (key !== '_id') {
          const hdr = { name: key, value: key };
          hdrs.push(hdr);
        }
      });
      return hdrs;
    },
    newitem() {
      if (!this.itemprops) return { textval: '' };
      const ni = {};
      Object.keys(this.itemprops).forEach(key => this.$set(ni, key, null));
      return ni;
    },
    citems() {
      if (!Array.isArray(this.items)) return [];
      return this.items;
    },
    em() {
      if (this.editingMode) return true;
      return false;
    },
  },
};
</script>

<style>
.formlist {
  background: #f1f1f1;
}
</style>
