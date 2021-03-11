import filters from "./default_filters";

export default [
  {
    caption: 'Search',
    arialabel: '',
    icon: 'search',
    abstract: '',
    startpage: {
      name: 'search',
      params: {
        lang: 'en',
        entity: 'entry',
        query: JSON.stringify({ ftsearch: '', operator: '$or'}),
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
]
