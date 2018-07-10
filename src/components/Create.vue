<template>
  <v-container class="mt-4">
    <div id="testing">
    <p>Model for debugging: {{ formModel }}</p>
      <h3>Test Autocomplete for Vocabs</h3>
      ARCHE_CATEGORY (eg.: sound): <AutocompVocabs type='ARCHE_CATEGORY' name='Test Vocabs' v-model="testVocabs"></AutocompVocabs>
      {{ testVocabs }}<br><br>
      ARCHE_LIFECYCLE_STATUS (eg.: active): <AutocompVocabs type='ARCHE_LIFECYCLE_STATUS' name='Test ARCHE_LIFECYCLE_STATUS' v-model="testARCHE_LIFECYCLE_STATUS"></AutocompVocabs>
      {{ testARCHE_LIFECYCLE_STATUS }}
      <AutocompDefault type='vocabstest' name='Test Vocabs via autocomplete' v-model="testVocabs2"></AutocompDefault>
      {{ testVocabs2 }} <br><br>

      Test identifier field:
      <HasIdentifierField name="randomName" v-model="hifTest"></HasIdentifierField>
    {{ hifTest }}
          <HasIdentifierField allowExists="true" name="randomName"></HasIdentifierField>

    </div>
    <v-layout row wrap>
      <v-flex xs12 md3 class="mr-2">
        <storetree class="tree"></storetree>
      </v-flex>
      <v-flex xs12 md8>
        <formfromschema v-model="formModel" type="person" uniqueName="uniqueFormSchema"></formfromschema>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import loadfile from './Store_LoadFile';
import storetree from './Store_Storetree';
import AutocompVocabs from './AutocompVocabs';
import formfromschema from './FormFromSchema';
import AutocompDefault from './AutocompDefault';
import HasIdentifierField from './HasIdentifierField';
import HELPERS from '../helpers';
/* eslint no-param-reassign: ["error", { "props": false }] */
export default {
  mixins: [HELPERS],
  components: {
    AutocompVocabs,
    loadfile,
    storetree,
    formfromschema,
    AutocompDefault,
    HasIdentifierField,
  },
  data() {
    return {
      testModel: '',
      testVocabs: '',
      testVocabs2: '',
      formModel: '',
      hifTest: '',
      testARCHE_LIFECYCLE_STATUS: '',
      endpoints: ['Person', 'Organisation', 'Place', 'Concept', 'Publication', 'Metadata'],
    };
  },
  methods: {},
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tree {
  max-height: 80vh;
  overflow: auto;
}
</style>
