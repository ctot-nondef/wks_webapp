<template>
  <v-card color="white lighten-2" class="pa-4 mb-4">
    <v-select v-model="itype" :items="itypes" label="Type"/>
    <autocompgnd :value="ientity" :type="itype" :multiple="false" @input="ientity=$event"/>
    <v-layout justify-end row fill-height>
      <v-btn color="warning" @click="importentity()">Import</v-btn>
      <v-btn color="primary" text @click.native="ientity=[]">Clear</v-btn>
    </v-layout>
  </v-card>
</template>

<script>
  /* eslint-disable no-underscore-dangle,no-param-reassign */
  import axios from 'axios';
  import autocompgnd from '../AutoCompleteComponents/AutocompGND';
  import importmaps from './importmaps';
  /* eslint no-unused-vars: ["error", {"args": "none"}] */
  /* eslint no-console: ["error", { allow: ["log"] }] */
  export default {
    mixins: [importmaps],
    components: {
      autocompgnd,
    },
    props: {
      itypes: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        ientity: [],
        itype: '',
      };
    },
    methods: {
      importentity() {
        if (this.ientity.id) {
          const id = this.ientity.id.split('/').slice(-1)[0];
          axios.get(`https://lobid.org/gnd/${id}`).then((res) => {
            this.$emit('importentity', this.mapGNDImport(this.itype, res.data));
          });
        }
      },
      mapGNDImport(type, obj) {
        // TODO: this could bve a lot shorter if we used MAP?
        const map = Object.keys(this[type]);
        let idx = map.length - 1;
        const res = {};
        while (idx + 1) {
          res[this[type][map[idx]]] = this._.get(obj, map[idx]);
          idx -= 1;
        }
        res.identifier = [`GND:${obj.gndIdentifier}`];
        res.labels = [{
          lang: 'de',
          label: obj.preferredName,
        }];
        return res;
      },
    },
    mounted() {
      this.itype = this.itypes[0];
    },
  };
</script>
