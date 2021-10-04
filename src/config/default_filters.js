export default {
  collect: { name: { $regex: '' } },
  inventory: { name: { $regex: '' }, partOf: null, 'creator.id': null, 'documents.0': { $exists: true } },
  entry: { name: { $regex: '' } },
  transaction: {  },
  actor: { name: { $regex: '' }, instanceOf: null },
  descriptor: { name: { $regex: '' }, instanceOf: null },
  object: { name: { $regex: ''}, originalTitle: { $regex: ''}, currentOwner: null },
}
