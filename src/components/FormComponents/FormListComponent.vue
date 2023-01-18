<template>
  <div class="formlist pa-3">
    <v-layout
      justify-space-between
      align-center
      row
    >
      <v-flex xs1>
        <v-label>{{ label }}</v-label>
      </v-flex>
      <v-flex xs1>
        <v-switch
          v-model="simpleform"
          :style="{visibility: !editingMode && simpleformavail ? 'visible' : 'hidden'}"
        />
      </v-flex>
    </v-layout>
    <!-- table view if array of objects -->
    <v-data-table
      v-if="itemprops"
      :headers="headers"
      :items="citems"
      class="elevation-1"
      hide-default-header
    >
      <template #header="{ props: { headers } }">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header.name"
            >
              {{ header.name }}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
      </template>
      <template #body="{ items }">
        <tbody>
          <tr
            v-for="(item, index) in items"
            :key="item.name"
          >
            <td
              v-for="header in headers"
              :key="header.name"
            >
              <template v-if="typeof item === 'object' && item[header.name] && item[header.name].name">
                {{ item[header.name].name }}
              </template>
              <!-- zotero refs for link parsing -->
              <template v-else-if="typeof item === 'object' && typeof item[header.name] === 'string' && header.name === 'ref'">
                <a
                  :href="item[header.name].replace('api.', '')"
                  target="_blank"
                >link</a>
              </template>
              <!-- transaction refs -->
              <template v-else-if="typeof item === 'object' && typeof item[header.name] === 'object' && item[header.name] !== null && header.name === 'ref'">
                {{ item[header.name]._id }}
              </template>
              <template v-else>
                {{ item[header.name] }}
              </template>
            </td>
            <td class="justify-center layout px-0">
              <v-icon
                small
                class="mr-2"
                :disabled="editingMode"
                @click="editItem(index)"
              >
                edit
              </v-icon>
              <v-icon
                small
                :disabled="editingMode"
                @click="removeItem(index,items)"
              >
                delete
              </v-icon>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
    <!-- list display if array of strings -->
    <v-list
      v-if="!itemprops && citems.length >= 1"
      two-line
    >
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        three-line
      >
        <v-list-item-content>
          <v-list-item-subtitle
            v-if="typeof item === 'string'"
            v-text="item"
          />
        </v-list-item-content>
        <v-btn
          fab
          dark
          small
          color="error"
          @click="removeItem(index,items)"
        >
          <v-icon dark>
            delete
          </v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
    <!-- form slot -->
    <v-layout
      justify-end
      row
      fill-height
    >
      <v-flex xs10>
        <v-layout
          v-if="!simpleform || editingMode"
          justify-start
          row
          fill-height
          wrap
          class="py-3"
        >
          <slot
            name="form"
            :newitem="newitem"
          />
        </v-layout>
        <v-layout
          v-else-if="simpleform && !editingMode"
          justify-start
          row
          fill-height
          wrap
          class="py-3"
        >
          <slot
            name="simpleform"
            :newitems="newitems"
          />
        </v-layout>
      </v-flex>
      <v-flex xs2>
        <v-btn
          v-if="!editingMode"
          ref="addbutton"
          center
          fab
          dark
          small
          color="warning"
          @click.native="addItem(newitem,items); clearItem()"
        >
          <v-icon dark>
            add
          </v-icon>
        </v-btn>
        <v-btn
          v-if="editingMode === true"
          center
          fab
          dark
          small
          color="warning"
          @click.native="saveItem(newitem,items)"
        >
          <v-icon dark>
            save
          </v-icon>
        </v-btn>
        <v-btn
          v-if="editingMode === true"
          center
          fab
          dark
          small
          color="warning"
          @click.native="cancelEditing()"
        >
          <v-icon dark>
            cancel
          </v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import HELPERS from '../../helpers';

export default {
  components: {
  },
  mixins: [HELPERS],
  props: [
    'label',
    'nodatamessage',
    'type',
    'items',
    'itemprops',
    'simpleformavail',
  ],
  data() {
    return {
      dialog: false,
      editedItem: null,
      editingMode: false,
      editingItemIndex: 0,
      simpleform: false,
    };
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
    newitems() {
      if (!this.itemprops) return null;
      return [{}, {}, {}, {}, {}];
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
  watch: {
  },
  mounted() {
    this.simpleform = this.simpleformavail;
  },
  methods: {
    addItem(item, items) {
      let a = items.slice();
      if (!item.textval && !this.simpleform) {
        const newitem = Object.assign({}, item);
        a.push(newitem);
      } else if (!item.textval && this.simpleform && Array.isArray(this.newitems)) {
        this.newitems.forEach((i) => {
          const newitem = Object.assign({}, i);
          if (Object.keys(newitem).length > 0) a.push(newitem);
        });
      } else {
        a.push(item.textval);
      }
      this.$emit('update:items', a);
    },
    removeItem(index, items) {
      let a = items.slice();
      a.splice(index, 1);
      this.$emit('update:items', a);
    },
    editItem(index) {
      this.editingItemIndex = index;
      this.editedItem = this.items[index];
      Object.keys(this.itemprops).forEach((key) => {
        if (key !== '_id') {
          this.$set(this.newitem, key, this.editedItem[key] || '');
        }
      });
      this.editingMode = true;
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
      this.$emit('update:items', this.items);
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
        if (Object.prototype.hasOwnProperty.call(child, 'reset')) {
          child.reset();
        }
        if (Object.prototype.hasOwnProperty.call(child, 'clear')) {
          child.clear();
          this.$set(child.$children[0], 'cachedItems', []);
        }
      });
      this.simpleform = this.simpleformavail;
    },
    update() {

    },
  },
};
</script>

<style>
  .formlist {
    background: #f1f1f1;
  }
</style>
