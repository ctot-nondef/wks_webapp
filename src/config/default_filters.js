export default {
  collect: { name: { $regex: '' } },
  inventory: { name: { $regex: '' }, partOf: null, 'creator.id': null, 'documents': { $size: 1 } },
  entry: { name: { $regex: '' } },
  transaction: {  },
  actor: { name: { $regex: '' }, instanceOf: null, identifier: { $regex: '' } },
  descriptor: { name: { $regex: '' }, instanceOf: null, identifier: { $regex: '' } },
  object: { name: { $regex: ''}, originalTitle: { $regex: ''}, currentOwner: null },
}
