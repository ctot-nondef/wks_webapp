<template>
  <div class="formlist">
    <v-layout justify-start row fill-height>
      <v-label>{{label}}</v-label>
    </v-layout>
    <p v-if="citems.length === 0"><i>{{nodatamessage}}</i></p>
    <v-data-table v-if="citems.length >= 1 && itemprops"
        :headers="headers"
        :items="items"
        class="elevation-1"
      >
      <template slot="headers" slot-scope="props">
        <th  v-for="header in props.headers">
          {{ header.name }}
        </th>
      </template>
      <template slot="items" slot-scope="props">
           <tr @click="props.expanded = !props.expanded">
              <td v-for="header in headers">
               <template  v-if="typeof props.item === 'object' && props.item[header.name] && props.item[header.name].name && header.name !== '_id'"> {{props.item[header.name].name}}</template>
                <template v-if="typeof props.item === 'object' && props.item[header.name] && typeof props.item[header.name] === 'string' || typeof props.item[header.name] === 'number'  && header.name !== '_id'">
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
   <v-list two-line v-if="!itemprops && citems.length >= 1">
      <v-list-tile v-for="(item, index) in items" v-bind:key="index">
        <v-list-tile-content>
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
        <v-btn ref="addbutton" v-if="editingMode === false" center fab dark small color="warning" @click.native="addItem(newitem,items);clearItem()">
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-btn v-if="editingMode === true" center fab dark small color="warning" @click.native="saveItem(newitem,items)">
          <v-icon dark>save</v-icon>
        </v-btn>
        <v-btn v-if="editingMode === true" center fab dark small color="warning" @click.native="cancelEditing();">
          <v-icon dark>cancel</v-icon>
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
  ],
  data() {
    return {
      dialog:false,
      editedItem: null,
      editingMode:false,
      editingItemIndex:0
    };
  },
  watch: {
  },
  methods: {
    ...mapActions("api", ["get"]),
    editItem (index) {
      this.editingMode = true;
      this.editingItemIndex = index;
      this.editedItem = this.items[index];
      Object.keys(this.editedItem).forEach(key => {
        this.$set(this.newitem,key,this.editedItem[key]);
      });
    },
    cancelEditing() {
      this.editingMode = false;
      this.clearItem();
    },
    saveItem() {
      console.log(this.editedItem);
      Object.keys(this.editedItem).forEach(key => {
        console.log(key);
        this.$set(this.items[this.editingItemIndex],key,this.newitem[key]);
      });
    },
    clearItem() {

      Object.keys(this.newitem).forEach(key => {
        if (key === 'textval') {
          this.$set(this.newitem,key,'');
        } else if (typeof this.newitem[key] === 'object') {
          this.$set(this.newitem,key,{});
        } else {
          this.$set(this.newitem,key,'');
        }
      });
     this.$children.forEach(child =>{
        if (child.hasOwnProperty('form')) {
          child.reset();
        }
        if (child.hasOwnProperty('select')) {
          child.clear();
          this.$set(child.$children[0],'cachedItems',[]);
        }
      });

    }
  },
  computed: {
    headers() {
      var hdrs= [];
      Object.keys(this.itemprops).forEach((key)=>{
        if (key !== '_id') {
          var hdr = {"name":key,"value":key}
          hdrs.push(hdr);
        }
      });
      return hdrs;
    },
    newitem() {
      if (!this.itemprops) {
        return {textval:''};
      } else {
        var ni = {};
        Object.keys(this.itemprops).forEach((key)=>{
        this.$set(ni,key,null);
        });
        return ni;
      }
    },
    citems() {
      if(!Array.isArray(this.items)) return []
      return this.items
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
