<template lang="html">
  <v-layout column justify-space-between>
    <v-dialog
      v-model="active"
      @keydown.esc="active=false"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="active=false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
          </v-toolbar-items>
          <v-btn color="warning" @click="saveItem()">Save</v-btn>
        </v-toolbar>
        <v-container grid-list-md text-xs-center>
          <v-card color="grey lighten-2" class="pa-4">
            <slot name="form" :item="item"></slot>
            <v-layout justify-end row fill-height>
              <v-btn color="warning" @click="saveItem()">Save</v-btn>
              <v-btn color="primary" flat @click.native="active=false">Discard</v-btn>
            </v-layout>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import HELPERS from '../helpers';
import { mapActions } from 'vuex';

export default {
  mixins: [HELPERS],
  props: {
    title: String,
    itemref: String,
  },
  data() {
    return {
      active: false,
      item: null,
    };
  },
  computed: {

  },
  methods: {
    ...mapActions('api', [
      'get',
      'post',
    ]),
    getItem(type, _id) {
      this.item = {};
      this.get({
        type,
        query: JSON.stringify({
          _id,
        }),
        populate: JSON.stringify([
          { path: 'inventory' },
          { path: 'place', select: 'name' },
          { path: 'partOf', select: 'name' },
          { path: 'creator.role', select: 'name' },
          { path: 'creator.id', select: 'name' },
          { path: 'classification.aspect', select: 'name' },
          { path: 'classification.descriptor', select: 'name' },
        ]),
      }).then((res) => {
        this.item = res.data[0];
        this.active = true;
      });
    },
    saveItem() {
      if (this.item._id) {
        if (this.item.creator) {
          this.item.creator.forEach((el, idx, c) => {
            const rel = {};
            Object.keys(el).forEach((key) => {
              if (el[key]) {
                rel[key] = el[key]._id || el[key];
              }
            });
            c[idx] = rel;
          });
        }
        if (this.item.classification) {
          this.item.classification.forEach((el, idx, c) => {
            const rel = {};
            Object.keys(el).forEach((key) => {
              if (el[key]) {
                rel[key] = el[key]._id || el[key];
              }
            });
            c[idx] = rel;
          });
        }
        if (this.item.place) {
          this.item.place = this.item.place._id;
        }
        if (this.item.partOf) {
          this.item.partOf = this.item.partOf._id;
        }
        this.post({ type: 'inventory', id: this.item._id, body: this.item }).then(() => {
          this.active = false;
          this.$emit('close');
        });
      }

    },
    discard() {
      // clear form component
      this.active = false;
      this.$emit('close');
    },
  },
};
</script>

<style lang="css">
</style>
