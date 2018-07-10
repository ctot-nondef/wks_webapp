<template>
  <v-layout @click="$emit('input', chosenItem)" column :class="{ greyBg: !bg, selected: this.uri === this.$route.query.uri }">
    <v-flex xs12>
      <v-layout row class="itemline" v-on:click="expanded = !expanded">
        <v-icon v-if="!expanded && children.length>0"  class="pointer">chevron_right</v-icon>
        <v-icon v-if="expanded && children.length>0"  class="pointer">expand_more</v-icon>
        <v-icon v-if="children.length==0" style="opacity:0;">expand_more</v-icon>
        <v-icon v-bind:class="{ expanded: 'teal lighten-3' }">{{ typeicon(IconByRepoType(getType(uri))) }}</v-icon>
        <v-layout grid-list-xs class="ml-2" column justify-center>
            <div class="itemcaption caption">{{ getTitle(uri).replace(/"/g, '') }}</div>
        </v-layout>
        <v-spacer></v-spacer>
        <v-flex xs1 >
          <div class="itemtoolbar">
            <v-layout row nowrap>
              <v-icon @click="clear">clear</v-icon>
              <v-icon @click="edit">create</v-icon>
            </v-layout>
          </div>
        </v-flex>
      </v-layout >
    </v-flex>
    <transition :duration="200" name="fadeDown" mode="in-out">
      <v-flex xs12 v-if="expanded && children.length>0">
          <v-layout row wrap v-for="(item, i) in children" :key="i" >
            <v-flex xs12>
              <item :uri="item" class="ml-2"></item>
            </v-flex>
          </v-layout>
      </v-flex>
    </transition>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import item from './Store_Storetreeitem';

import HELPERS from '../helpers';
/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", { allow: ["log"] }] */

export default {
  mixins: [HELPERS],
  data() {
    return {
      title: '',
      expanded: false,
      children: [],
      popup: true,
      dialog: false,
      params: {},
      chosenItem: {},
    };
  },
  name: 'item',
  props: [
    'uri',
    'bg',
    'itemFull',
  ],
  components: {
    item,
  },
  computed: {
    ...mapGetters('n3', [
      'getCount',
      'getTriples',
      'getTitle',
      'getType',
    ]),
  },
  methods: {
    ...mapActions('n3', [
      'RemoveSubject',
    ]),
    ...mapMutations('dialogs', [
      'setDialog',
      'closeDialog',
    ]),
    getChildren(uri) {
      const children = this.getTriples(
        { predicate: 'https://vocabs.acdh.oeaw.ac.at/schema#isPartOf',
          object: uri,
        });
      if (children.length > 0) {
        let idx = children.length - 1;
        while (idx + 1) {
          this.children.push(children[idx].subject);
          idx -= 1;
        }
      }
    },
    update() {
      // TODO: there needs to be some URI validation here and in the
      // root storetree + probably in the module itself
      this.title = this.getTitle(this.uri);
      this.getChildren(this.uri);
    },
    clear() {
      if (this.$store.state.n3.deletePrompt) {
        this.dialog = true;
        this.setDialog({ name: 'deletesubjectdialog', obj: { status: true, uri: this.uri } });
      } else {
        this.RemoveSubject(this.uri);
      }
    },
    edit() {
      const triples = this.getTriples({ subject: this.uri });
      this.params = {};
      for (let i = 0; i < triples.length; i += 1) {
        if (this.params[triples[i].predicate.replace('https://vocabs.acdh.oeaw.ac.at/schema#', '')]) {
          this.params[triples[i].predicate.replace('https://vocabs.acdh.oeaw.ac.at/schema#', '')].push(triples[i].object.replace(/"/g, ''));
        } else {
          this.params[triples[i].predicate.replace('https://vocabs.acdh.oeaw.ac.at/schema#', '')] = [triples[i].object.replace(/"/g, '')];
        }
      }
      this.params.uri = this.uri;
      this.$router.push({ name: 'create', query: this.params });
    },
  },
  created() {

  },
  mounted() {
    // this.$debug('itemFull', this.itemFull);
    this.chosenItem = this.itemFull;
    this.update();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.itemline {
  width:100%;
}

.itemtoolbar {
  position: absolute;
  right: 0px;
  width: 0px;
  overflow: hidden;
  cursor: pointer;
  background-color: white;
  opacity: 0.8;
  -webkit-transition: width 0.3s;
  transition: width 0.3s;
}

.itemline:hover .itemtoolbar {
  width: 60px;
}

.itemcaption {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.greyBg {
  background-color: #EEE;
}
.selected {
  background-color: #80CBC4;
}
</style>
