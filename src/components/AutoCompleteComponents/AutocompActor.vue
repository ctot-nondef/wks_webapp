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
import { mapActions } from "vuex";
import HELPERS from "../../helpers";

export default {
  mixins: [HELPERS],
  props: ['value', 'label', 'multiple','parententity'],
  data() {
    return {
      loading: false,
      items: [],
      search: null,
      select: [] || '',
    };
  },
  watch: {
    search(newval, oldval) {
      if (newval) {
        this.querySelections(newval);
      }
    },
   parententity() {
     console.log("log something");
      this.select.length = 0;
      this.items.length = 0;
       if (this.value.length > 0) {
      var that = this;
      this.value.forEach(ref => {
        if (that.select.indexOf(ref) === -1) {
          console.log("ref: " + ref);
          this.get({
            type: "actor",
            query: JSON.stringify({
              _id: ref
            })
          }).then(res => {
            that.addItem(res.data[0], that.select);
            that.addItem(res.data[0], that.items);
          });
        }
      });
    }
   }, 
  },
  methods: {
    querySelections() {
      this.loading = true;
      // this.$info(vm);
      this.get({
        type: "actor",
        query: JSON.stringify({
          name: { $regex: this.search || "" }
        })
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
    ...mapActions("api", ["get"]),
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
