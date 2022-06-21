import faker from 'faker'

function buildUser(overrides) {
  return {
    id: faker.datatype.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    ...overrides,
  }
}

function buildBook(overrides) {
  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.words(),
    author: faker.name.findName(),
    coverImageUrl: faker.image.imageUrl(),
    pageCount: faker.datatype.number(400),
    publisher: faker.company.companyName(),
    synopsis: faker.lorem.paragraph(),
    ...overrides,
  }
}

function buildListItem(overrides = {}) {
  const {
    bookId = overrides.book ? overrides.book.id : faker.datatype.uuid(),
    startDate = faker.date.past(2).getTime(),
    finishDate = faker.date.between(startDate, new Date()).getTime(),
    owner = {ownerId: faker.datatype.uuid()},
  } = overrides
  return {
    id: faker.datatype.uuid(),
    bookId,
    ownerId: owner.id,
    rating: faker.datatype.number(5),
    notes: faker.datatype.boolean() ? '' : faker.lorem.paragraph(),
    finishDate,
    startDate,
    book: buildBook({id: bookId}),
    ...overrides,
  }
}

export {buildUser, buildListItem, buildBook}
