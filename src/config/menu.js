import filters from "./default_filters";

export default [
  {
    caption: 'Home',
    arialabel: '',
    icon: 'home',
    abstract: '',
    startpage: {
      name: 'start',
      params: {
        lang: 'en' },
    },
    items: '',
  },
  {
    caption: 'Search & Query',
    arialabel: '',
    icon: 'search',
    abstract: '',
    startpage: {
      name: 'query',
      params: {
        lang: 'en',
        entity: 'entry',
        query: JSON.stringify({ Kunstgattung: null, Thema: null, Datierung: null, Schule: null, partOf: null })
      }},
    items: '',
  },
  {
    caption: 'Browse',
    arialabel: '',
    icon: 'list',
    abstract: '',
    startpage: {
      name: 'query',
      params: {
        lang: 'en',
        entity: 'collect',
        query: JSON.stringify(filters.collect)
      }},
    items: '',
  },
  {
    caption: 'Objects',
    arialabel: '',
    icon: 'category',
    abstract: '',
    startpage: {
      name: 'query',
      params: {
        lang: 'en',
        entity: 'object',
        query: JSON.stringify(filters.object),
      }},
    items: '',
  },
  {
    caption: 'Actors',
    arialabel: '',
    icon: 'person',
    abstract: '',
    startpage: {
      name: 'query',
      params: {
        lang: 'en',
        entity: 'actor',
        query: JSON.stringify(filters.actor),
      }},
    items: '',
  },
  {
    caption: 'Thesaurus',
    arialabel: '',
    icon: 'device_hub',
    abstract: '',
    startpage: {
      name: 'query',
      params: {
        lang: 'en',
        entity: 'descriptor',
        query: JSON.stringify(filters.descriptor),
      }},
    items: '',
  },
  {
    caption: 'User Settings',
    arialabel: '',
    icon: 'people_outline',
    abstract: '',
    startpage: {
      name: 'users',
      params: {
        lang: 'en' },
    },
    items: '',
  },
]
