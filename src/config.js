export default {
  logo: '/static/fundament_logo.svg',
  title: 'MetaDataEditor',
  color: 'primary',
  homestate: {
    name: 'start',
    params: {
      lang: 'en' },
  },
  menu: [
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
      caption: 'Collections',
      arialabel: '',
      icon: 'collections',
      abstract: '',
      startpage: {
        name: 'query',
        params: {
          lang: 'en',
          entity: 'collect',
          query: '{"name":{"$regex":null}}',
        },
      },
      items: '',
    },
    {
      caption: 'Inventories',
      arialabel: '',
      icon: 'assignment',
      abstract: '',
      startpage: {
        name: 'query',
        params: {
          lang: 'en',
          entity: 'inventory',
          query: '{"name":{"$regex":null}}',
        },
      },
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
          query: '{"name":{"$regex":null}}',
        },
      },
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
          query: '{ "name": { "$regex": null }, "instanceOf": null, "identifier": { "$regex": null } }',
        },
      },
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
          query: '{ "name": { "$regex": null }, "instanceOf": null, "identifier": { "$regex": null } }',
        },
      },
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
  ],
  defaultlistheaders: {
    collect: [
      { text: 'Name', value: 'name', path: 'name' },
      { text: 'Actions' },
    ],
    inventory: [
      { text: 'Name', value: 'name', path: 'name' },
      { text: 'Actions' },
    ],
    entry: [
      { text: 'Name', value: 'name', path: 'name' },
      { text: 'Original Title', value: 'originalTitle', path: 'originalTitle' },
      { text: 'Actions' },
    ],
    object: [
      { text: 'Name', value: 'name', path: 'name' },
      { text: 'Original Title', value: 'originalTitle', path: 'originalTitle' },
      { text: 'Actions' },
    ],
    transaction: [
      { text: 'Date', value: 'date' },
      { text: 'Actor', value: 'actor[0].id.name' },
      { text: 'Actions' },
    ],
    actor: [
      { text: 'Name', value: 'name', path: 'name' },
      { text: 'Type', value: 'instanceOf', path: 'instanceOf._labels[4].label' },
      { text: 'Actions' },
    ],
    descriptor: [
      { text: 'Name', value: 'name', path: 'name' },
      { text: 'Type', value: 'instanceOf', path: 'instanceOf._labels[4].label' },
      { text: 'Description', value: 'description', path: 'description' },
      { text: 'Actions' },
    ],
  },
  defaultfilters: {
    collect: { name: { $regex: null } },
    inventory: { name: { $regex: null } },
    entry: { name: { $regex: null } },
    transaction: { name: { $regex: null } },
    actor: { name: { $regex: '' }, instanceOf: null, identifier: { $regex: '' } },
    descriptor: { name: { $regex: '' }, instanceOf: null, identifier: { $regex: '' } },
  },
  repo: '',
  api: 'https://wks.acdh-dev.oeaw.ac.at',
};
