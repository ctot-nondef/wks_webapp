<template lang="html">
  <v-layout column justify-space-between>
    <v-dialog
      v-model="active"
      @keydown.esc="discard"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="discard">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
          </v-toolbar-items>
          <v-btn color="warning" @click="saveAsNewItem" :disabled="!nameEdited">Save as New</v-btn>
          <v-btn color="warning" @click="saveItem" >Save</v-btn>
        </v-toolbar>
        <v-container grid-list-md text-xs-center>
          <v-card color="grey lighten-2" class="pa-4">
            <component :is="componentLoader" :value="item" @input="item = Object.assign(item, $event)"></component>
            <v-layout justify-end row fill-height>
              <v-btn color="warning" @click="saveItem">Save</v-btn>
              <v-btn color="primary" flat @click.native="discard">Discard</v-btn>
            </v-layout>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  /* eslint-disable no-underscore-dangle */
import { mapActions, mapGetters } from 'vuex';

export default {
    props: {
      title: String,
      itemref: String,
    },
    data() {
      return {
        active: false,
        item: {},
        type: null,
        nameEdited: false,
      };
    },
    computed: {
      ...mapGetters('api', [
        'getPathsByName',
        'getReversePathsByName',
      ]),
      componentLoader() {
        if (this.type) return () => import(/* webpackMode: "eager" */ `./Forms/${this.type}_form`);
        return null;
      },
    },
    watch: {
      'item.name': {
        handler(a, b) {
          if (b !== undefined && a !== undefined && b !== a) {
            this.nameEdited = true;
          }
        },
      },
    },
    methods: {
      ...mapActions('api', [
        'get',
        'post',
      ]),
      getItem(type, _id) {
        this.item = {};
        this.type = type;
        this.get({
          type,
          query: { _id },
          populate: JSON.stringify(
            this.getPathsByName(type).map(path => ({ path }))
            .concat(this.getReversePathsByName(type).map(path => ({ path }))),
          ),
        }).then((res) => {
          this.item = res.data[0];
          this.active = true;
        });
      },
      newItem(type, defaultvalues) {
        this.active = true;
        this.item = null;
        this.item = defaultvalues;
        this.type = type;
      },
      saveItem() {
        if (this.item._id) {
          this.post({ type: this.type, id: this.item._id, body: this.item }).then(() => {
            this.close();
          });
        } else {
          this.post({ type: this.type, body: this.item }).then(() => {
            this.close();
          });
        }
      },
      saveAsNewItem() {
        delete this.item._id;
        delete this.item.identifier;
        this.post({ type: this.type, body: this.item }).then(() => {
          this.nameEdited = false;
        });
      },
      discard() {
        // TODO: confirmation dialog
        this.close();
      },
      close() {
        this.item = {};
        this.nameEdited = false;
        this.active = false;
        this.type = null;
        this.$emit('close');
      },
    },
};
</script>
