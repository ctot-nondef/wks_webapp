<template>
  <div class="formlist">
    <v-layout justify-start row fill-height>
      <v-label>{{label}}</v-label>
    </v-layout>
    <p v-if="items && items.length === 0"><i>{{nodatamessage}}</i></p>
    <v-list two-line v-if="items && items.length >= 1">
      <v-list-tile v-for="(item, index) in items" v-bind:key="index">
        <v-list-tile-content>
         <v-list-tile-title  v-for="(value, propname, index) in itemprops" v-bind:key="index"  v-if="item && typeof item === 'object' && item[propname] && item[propname].name" v-text="item[propname].name"></v-list-tile-title>
         <v-list-tile-title  v-for="(value, propname, index) in itemprops"   v-if="item && typeof item === 'object' && propname !== '_id' && typeof item[propname] === 'string' || typeof item[propname] === 'number'" v-text="item[propname]"></v-list-tile-title>
         <!-- <formlistitem v-if="itemprops && item[propname] && propname !== '_id'" :styletype="listitemstyletypes[index - 1]" :index="index" v-for="(value, propname, index) in itemprops" :refsto="item[propname]" :itemprop="value" v-bind:key="index" />-->
          <v-list-tile-title v-if="typeof item === 'string'" v-text="item"></v-list-tile-title>
        </v-list-tile-content>
        <v-btn fab dark small color="error" @click="removeItem(index,items);">
          <v-icon dark>delete</v-icon>
        </v-btn>
      </v-list-tile>
    </v-list>
    <v-layout justify-end row fill-height> 
      <v-flex xs10>
        <slot name="form" :newitem="newitem"></slot>
      </v-flex>
      <v-flex xs2>
        <v-btn center fab dark small color="warning" @click.native="addItem(newitem,items);">
          <v-icon dark>add</v-icon>
        </v-btn> 
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import HELPERS from "../../helpers";
import formlistitem from "./FormListItem";

export default {
  components: {
    formlistitem
},
  mixins: [HELPERS],
  props: [
    "label",
    "nodatamessage",
    "type",
    "items",
    "itemprops",
    "listitemstyletypes"
  ],
  data() {
    return {
    };
  },
  watch: {},
  methods: {
    ...mapActions("api", ["get"])
  },
  computed: {
    newitem() {
      if (!this.itemprops) {
        return {textval:''};
      } else {
        return {};
      }
    }
  },
};
</script>

<style>
.formlist {
  background: #f1f1f1;
  padding: 10px;
}
</style>