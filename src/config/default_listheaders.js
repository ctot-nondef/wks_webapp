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
    { text: 'Creator', value: 'creator.id', path: 'creator[0].id.name' },
    { text: 'Original Title', value: 'originalTitle', path: 'originalTitle' },
    { text: 'Actions' },
  ],
  object: [
    { text: 'Name', value: 'name', path: 'name' },
    { text: 'Original Title', value: 'originalTitle', path: 'originalTitle' },
    { text: 'Actions' },
  ],
  transaction: [
    { text: 'Date', value: 'date', path: 'date' },
    { text: 'Actor', value: 'actor.id', path: 'actor[0].id.name' },
    { text: 'From', value: 'entry_destitution_ref', path: 'entry_destitution_ref[0].name' },
    { text: 'To', value: 'entry_acquisition_ref', path: 'entry_acquisition_ref[0].name' },
    { text: 'Price', value: 'price.amount', path: 'price[0].amount' },
    { text: 'Currency', value: 'price.currency', path: 'price[0].currency.name' },
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
