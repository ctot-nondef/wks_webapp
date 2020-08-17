export default {
  collect: { name: { $regex: null } },
  inventory: { name: { $regex: null }, partOf: null, 'creator.id': null },
  entry: { name: { $regex: null } },
  transaction: { name: { $regex: null } },
  actor: { name: { $regex: '' }, instanceOf: null, identifier: { $regex: '' } },
  descriptor: { name: { $regex: '' }, instanceOf: null, identifier: { $regex: '' } },
  object: { name: { $regex: ''}, currentOwner: null },
}