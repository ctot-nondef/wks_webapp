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
        query: JSON.stringify({ fti: '', ftioperator: '$or', Kunstgattung: null, Schule: null, Datierung: null, partOf: null }),
      }},
    items: '',
  },
  {
    caption: 'Filter',
    arialabel: '',
    icon: 'filter_list',
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
    caption: 'Collections',
    arialabel: '',
    icon: 'collections',
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
    caption: 'Objects',
    arialabel: '',
    icon: 'category',
    abstract: '',
    startpage: {
      name: 'query',
      params: {
        lang: 'en',
        entity: 'entry',
        query: JSON.stringify(filters.entry),
      }},
    items: '',
  },
  {
    caption: 'Transactions',
    arialabel: '',
    icon: 'compare_arrows',
    abstract: '',
    startpage: {
      name: 'query',
      params: {
        lang: 'en',
        entity: 'transaction',
        query: JSON.stringify(filters.transaction),
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
    caption: 'Inventories & Catalogs',
    arialabel: '',
    icon: 'chrome_reader_mode',
    abstract: '',
    startpage: {
      name: 'query',
      params: {
        lang: 'en',
        entity: 'inventory',
        query: JSON.stringify(filters.inventory),
      }},
    items: '',
  },
]
