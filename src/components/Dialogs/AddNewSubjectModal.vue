<!-- TODO: specify types the user can select and return ID  -->

<template lang="html">
  <!-- store deletion -->
  <v-dialog  v-model="$store.state.dialogs[name].status" fullscreen>
    <v-card>
      <v-card-title>
        Select From Store or Create New Subject
      </v-card-title>
      <v-card-text color="primary">
        <storetree v-model="storeTreeSelection" class="tree"></storetree>
        <p>Select an item from the stored items above. this will return the identifier of the subject. Or you can create a new Entry [based on your tree selection] below. (not impemented yet)</p>
        <form>
          <v-text-field label="subject" placeholder="Placeholder" v-model="storeTreeSelection.subject"></v-text-field>
          <v-text-field label="predicate" placeholder="Placeholder" v-model="storeTreeSelection.predicate"></v-text-field>
          <v-text-field label="object" placeholder="Placeholder" v-model="storeTreeSelection.object"></v-text-field>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="deleteItem();" color="secondary" large>
          Cancel
        </v-btn>
        <v-btn :disabled="!storeTreeSelection" @click="ChangeItem();" color="primary" large>
          Select
        </v-btn>
      </v-card-actions>

      <p>old item: {{ item }}</p>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations } from 'vuex';

import HELPERS from '../../helpers';
import storetree from '../Store_Storetree';

export default {
  components: {
    storetree,
  },
  computed: {
    item() {
      return this.$store.state.dialogs[this.name].item;
    },
  },
  data() {
    return {
      name: 'addnewsubjectmodal',
      storeTreeSelection: '',
    };
  },
  watch: {
  },
  mixins: [HELPERS],
  methods: {
    ...mapMutations('dialogs', [
      'closeDialog',
      'setDialog',
    ]),
    ChangeItem() {
      this.setDialog({
        name: this.name,
        obj: {
          status: false,
          item: this.item,
          changedItem: this.storeTreeSelection,
        },
      });
    },
    deleteItem() {
      this.setDialog({
        name: this.name,
        obj: {
          status: false,
          item: this.item,
          delete: true,
        },
      });
    },
  },
};
</script>

<style lang="css">
</style>
