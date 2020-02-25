export default {
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
    { text: 'Actor', value: 'actor.id', path: 'actor[0].id.name' },
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
}