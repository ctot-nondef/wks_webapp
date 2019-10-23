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
  repo: '',
  api: 'https://wks.acdh-dev.oeaw.ac.at',
};
