export default {
  data() {
    return {
      Person: {
        preferredName: 'name',
        dateOfBirth: 'beginOfExistence',
        dateOfDeath: 'endOfExistence',
        'biographicalOrHistoricalInformation[0]': 'description',
      },
      CorporateBody: {
        preferredName: 'name',
        dateOfEstablishment: 'beginOfExistence',
        dateOfTermination: 'endOfExistence',
      },
      PlaceOrGeographicName: {
        preferredName: 'name',
        'biographicalOrHistoricalInformation[0]': 'description',
        definition: 'description',
      },
      SubjectHeading: {
        preferredName: 'name',
        'definition[0]': 'description',
      },
    };
  },
};
