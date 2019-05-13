# Outline

## Logistics

### Breaks

- Three 10 minute breaks
- One 30 minute break

### Zoom

- Asking Questions
- Breakout Rooms

### Workflow

- Open the exercise codesandbox/checkout the branch
- Read through the `INSTRUCTIONS.md`
- Start Breakout Rooms
- Go through every mentioned file and follow the instructions from the emoji
- I pop in the breakout rooms to check for questions
- We all come back together
- I go through the solution and answer questions
- Move on to the next exercise.
- Repeat.

## App Intro

### App Demo

### Data Model

- User

  - id: string
  - username: string

- List Item

  - id: string
  - bookId: string
  - ownerId: string
  - rating: number (-1 is no rating, otherwise it's 1-5)
  - notes: string
  - startDate: number (`Date.now()`)
  - finishDate: number (`Date.now()`)

> For convenience, our friendly backend engineers also return a `book` object on
> each list item which is the book it's associated to. Thanks backend folks!

> /me wishes we could use GraphQL

If your "database" gets out of whack, you can purge it via:

```javascript
window.__bookshelf.purgeUsers()
window.__bookshelf.purgeListItems()
```

- Book

  - id: string
  - title: string
  - author: string
  - coverImageUrl: string
  - pageCount: number
  - publisher: string
  - synopsis: string

## Exercises

### Manage forms (login and registration form)

[![Edit login-form](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/kentcdodds/bookshelf/tree/exercises/login-form?module=%2FINSTRUCTIONS.md)

```
git checkout exercises/login-form
```

### Add authentication (auth-context)

[![Edit](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/kentcdodds/bookshelf/tree/exercises/auth?module=%2FINSTRUCTIONS.md)

```
git checkout exercises/auth
```

### @reach/router (setup all routes)

[![Edit](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/kentcdodds/bookshelf/tree/exercises/router?module=%2FINSTRUCTIONS.md)

```
git checkout exercises/router
```

### App State (List Items)

[![Edit](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/kentcdodds/bookshelf/tree/exercises/app-state?module=%2FINSTRUCTIONS.md)

```
git checkout exercises/app-state
```

### Code-splitting (add code-splitting the authenticated and unauthenticated pages)

[![Edit](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/kentcdodds/bookshelf/tree/exercises/code-splitting?module=%2FINSTRUCTIONS.md)

```
git checkout exercises/code-splitting
```
