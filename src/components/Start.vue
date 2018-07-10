<template>
  <div class="">
      <fundamentjumbo
        src="/static/intro_bg.jpg"
        caption="MetaDataEditor"
        subtitle="I'm supposed to be able to load and Edit ttl files for ingest in Arche."
      >
      </fundamentjumbo>
      <v-container grid-list-md>
        <v-layout justify-space-around row wrap>
          <fundamentsectiondiv icon="stars" caption="Getting Started"></fundamentsectiondiv>
          <v-flex xs12 sm6>
            <fundamentcard
              caption="Load an existing ttl File."
              :link="{ name: 'store', params: { lang: 'en' }}"
            >
              <p class="card-text">Load and edit an existing file from your Disk.</p>
            </fundamentcard>
          </v-flex>
          <v-flex xs12 sm6>
            <fundamentcard
              caption="Create a new Project"
              :link="{ name: 'create', params: { lang: 'en' }}"
            >
              <p class="card-text">Create a new Project for archival in Arche.</p>
            </fundamentcard>
          </v-flex>
          <fundamentsectiondiv icon="description" caption="Documentation"></fundamentsectiondiv>
          <v-flex xs12 sm4>
            <fundamentcard
              caption="Load an existing ttl File."
              :link="{ name: 'store', params: { lang: 'en' }}"
            >
              <p class="card-text">Load and edit an existing file from your Disk.</p>
            </fundamentcard>
          </v-flex>
          <v-flex xs12 sm4>
            <fundamentcard
              caption="Create a new Project"
              :link="{ name: 'create', params: { lang: 'en' }}"
            >
              <p class="card-text">Create a new Project for archival in Arche.</p>
            </fundamentcard>
          </v-flex>
          <v-flex xs12 sm4>
            <fundamentcard
              caption="Create a new Project"
              :link="{ name: 'create', params: { lang: 'en' }}"
            >
              <p class="card-text">Create a new Project for archival in Arche.</p>
            </fundamentcard>
          </v-flex>
        </v-layout>
      </v-container>
  </div>
</template>

<script>
import fundamentjumbo from './Fundament/FundamentJumbo';
import fundamentcard from './Fundament/FundamentCard';
import fundamentsectiondiv from './Fundament/FundamentSectionDiv';

export default {
  components: {
    fundamentjumbo,
    fundamentcard,
    fundamentsectiondiv,
  },
  name: 'start',
  data() {
    return {
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
