<template>
  <v-content>
      <v-data-table
        :headers="headers"
        :items="LibData"
        :options.sync="pagination"
        :server-items-length="totalItems"
        :loading="loading"
        class="elevation-1"
        :footer-props="{
            showFirstLastPage: true,
            firstIcon: 'mdi-arrow-collapse-left',
            lastIcon: 'mdi-arrow-collapse-right',
            prevIcon: 'mdi-minus',
            nextIcon: 'mdi-plus',
            'items-per-page-options': [10, 20, 50, 100, 250],
        }"
        loading-text="Loading... Please wait"
      >
          <template v-slot:body="{ items }">
              <tbody>
              <tr v-for="item in items" :key="item.name">
                  <td  class="text-xs-right"  v-if="item.data.creators[0].creatorType!='author'" > <span v-for="(author, index) in item.data.creators" :key="index" >{{ author.firstName }} {{ author.lastName }} [ {{ author.creatorType }} ]/</span> </td>
                  <td  class="text-xs-right" v-if="item.data.creators[0].creatorType=='author'" > <span>{{ item.data.creators[0].firstName }} {{ item.data.creators[0].lastName }} [ {{ item.data.creators[0].creatorType }} ]/</span> </td>
                  <td>{{ item.data.title }}</td>
                  <td  class="text-xs-right">{{ item.data.date }}</td>
                  <td  class="text-xs-right"><v-btn dark class="warn" @click="returnRef(item)">SELECT</v-btn></td>
              </tr>
              </tbody>
          </template>
      </v-data-table>
  </v-content>
</template>

<script>
import HELPERS from '../../helpers';
import ZOTERO from '../../zotero';

export default {
  mixins: [HELPERS, ZOTERO],
  data: () => ({
    LibData: [],
    LibToFetch: '2258599',
    loading: false,
    itemOptions: [10, 20, 50, 100, 250],
    totalItems: 9,
    search: '',
    pagination: {},
    selected: [],
    headers: [
      { text: 'Author', value: 'creator' },
      { text: 'Titel', align: 'left', value: 'title' },
      { text: 'Datum', value: 'date' },
      { text: 'Details', value: 'creator' },
    ],
  }),
  watch: {
      pagination: {
          handler() {
              this.fetchLib();
          },
          deep: true,
      },
  },
  created() {
    this.fetchLib();
  },
  methods: {
    fetchLib() {
      this.loading = true;
      this.getLibrary(this.LibToFetch,
        this.pagination.page,
        this.pagination.itemsPerPage,
        this.pagination.sortBy ? this.pagination.sortBy[0] : null,
        !this.pagination.sortDesc ? 'asc' : 'desc',
      ).then((res) => {
        this.LibData = res.data;
        this.loading = false;
      });
    },
    returnRef(item) {
      this.$emit('selectref', item);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
