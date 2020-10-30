import faker from 'faker'

function buildUser(overrides) {
  return {
    id: faker.random.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    ...overrides,
  }
}

function buildBook(overrides) {
  return {
    id: faker.random.uuid(),
    title: faker.lorem.words(),
    author: faker.name.findName(),
    coverImageUrl: faker.image.imageUrl(),
    pageCount: faker.random.number(400),
    publisher: faker.company.companyName(),
    synopsis: faker.lorem.paragraph(),
    ...overrides,
  }
}

function buildListItem(overrides = {}) {
  const {
    bookId = overrides.book ? overrides.book.id : faker.random.uuid(),
    startDate = faker.date.past(2).getTime(),
    finishDate = faker.date.between(startDate, new Date()).getTime(),
    owner = {ownerId: faker.random.uuid()},
  } = overrides
  return {
    id: faker.random.uuid(),
    bookId,
    ownerId: owner.id,
    rating: faker.random.number(5),
    notes: faker.random.boolean() ? '' : faker.lorem.paragraph(),
    finishDate,
    startDate,
    book: buildBook({id: bookId}),
    ...overrides,
  }
}

export {buildUser, buildListItem, buildBook}
