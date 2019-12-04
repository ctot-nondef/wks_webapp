<template>
  <v-content v-if="!loading">
    <section id="nodemission">
      <v-container grid-list-md text-xs-center class="mt-5 mb-5" >
        <v-layout class="pt-5 pb-5" row wrap align-start justify-center>
        <v-flex xs12 md9 lg7>
          <h2 class="headline">{{ ItemData.title }}</h2>
          <div justify-center >
            <v-list two-line class="elevation-1">
              <v-list-item v-for="(Author, index) in ItemData.creators" :key="index" >
                <v-list-item-avatar>
                  <v-icon class="grey lighten-1 white--text">person</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ Author.creatorType }}</v-list-item-title>
                  <v-list-item-subtitle>{{ Author.firstName }} {{ Author.lastName }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item avatar>
                <v-list-item-avatar>
                  <v-icon class="grey lighten-1 white--text">access_time</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Erschienen</v-list-item-title>
                  <v-list-item-subtitle>{{ ItemData.date }} {{ ItemData.place }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-itemv-if="ItemData.itemType != 'book'">
                <v-list-item-avatar>
                  <v-icon class="grey lighten-1 white--text">book</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Enthalten in</v-list-item-title>
                  <v-list-item-subtitle v-if="ItemData.itemType == 'journalArticle'">{{ ItemData.publicationTitle }}, {{ ItemData.pages }}</v-list-item-subtitle>
                  <v-list-item-subtitle v-if="ItemData.itemType == 'bookSection'">{{ ItemData.bookTitle }}, {{ ItemData.volume }} ,{{ ItemData.pages }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-btn dark class="accent" text :href="`https://api.zotero.org/groups/2083331/items/${ItemData.key}?format=bib`" target="_blank">Zitation</v-btn>
            <v-btn dark class="accent" text :href="`https://api.zotero.org/groups/2083331/items/${ItemData.key}?format=ris`" target="_blank">Export(RIS)</v-btn>
            <v-btn dark class="accent" text :href="`https://api.zotero.org/groups/2083331/items/${ItemData.key}?format=bibtex`" target="_blank">Export(BibTeX)</v-btn>
          </div>
        </v-flex>
        <v-flex xs0 md12 lg1 hidden-sm-and-down></v-flex>
        <v-flex lg6 xl4 hidden-sm-and-down>
          <v-layout column align-center >
            <!-- <v-flex v-for="(img, index) in mission[0].imagefull" :key="index">
              <img :src="img.url" style="max-width:450px;" >
            </v-flex> -->
          </v-layout>
        </v-flex>
        </v-layout>
      </v-container>
      <v-layout
        column
        wrap
        class="my-5"
        align-center
      >
        <v-flex xs12 sm4 class="my-3">
          <div class="text-xs-center">

          </div>
        </v-flex>
      </v-layout>
    </section>
  </v-content>
</template>

<script>
import HELPERS from '../../helpers';
import ZOTERO from '../../zotero';

export default {
  mixins: [HELPERS, ZOTERO],
  data: () => ({
    LibToFetch: '2083331',
    loading: true,
    totalItems: 7,
    search: '',
    pagination: {
      rowsPerPage: 10,
    },
    selected: [],
  }),
  props: ['zkey'],
  watch: {
  },
  created() {
    this.getItem(this.LibToFetch, this.zkey).then((res) => {
      this.ItemData = res.data.data;
      this.loading = false;
    });
  },
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
